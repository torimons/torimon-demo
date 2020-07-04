import { Component, Vue } from 'vue-property-decorator';
import 'leaflet/dist/leaflet.css';
import { mapViewGetters } from '@/store';
import L, { LeafletEvent, Marker } from 'leaflet';
import { Coordinate, SpotType, Shape } from '@/store/types';
import Map from '@/Map/Map.ts';
import EditorToolBar from '@/components/EditorToolBar/index.vue';
import SpotEditor from '@/components/SpotEditor/index.vue';
import Spot from '@/Spot/Spot';
import SpotMarker from '@/components/MapView/Marker/SpotMarker';
import { GeoJsonObject, GeometryObject, Feature, FeatureCollection, Polygon } from 'geojson';
import { Action } from '../EditorToolBar';
import ShapeEditor from './ShapeEditor';

@Component({
    components: {
        EditorToolBar,
        SpotEditor,
    },
})
export default class CreationMapView extends Vue {
    private lMap!: L.Map;
    private defaultZoomLevel: number = 17;
    private leafletContainer!: HTMLElement | null;
    private map: Map = new Map(0, 'New Map', {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    });
    // 次にクリックしたときに設置されるスポットタイプ
    private spotTypeToAddNext: SpotType = 'default';
    private shapeEditButtonIsVisible: boolean = false;
    private disabledShapeEditButtonInSpotEditor: boolean = false;
    private focusedSpot: Spot | null = null;
    private spotMarkers: SpotMarker[] = [];
    private shapeEditor!: ShapeEditor;

    /**
     * とりあえず地図の表示を行なっています．
     */
    public mounted() {
        // マップの範囲選択機能を実装していないので仮の範囲
        const rootMapCenter: Coordinate = Map.calculateCenter(mapViewGetters.rootMap.getBounds());
        this.lMap = L.map('map', {zoomControl: false})
            .setView([rootMapCenter.lat, rootMapCenter.lng], this.defaultZoomLevel);
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 23,
                maxNativeZoom: 19,
            },
        ).addTo(this.lMap);
        this.lMap.on('click', (e) => this.onMapClick(e));
        if (document.querySelector('.leaflet-container') !== null) {
            this.leafletContainer = document.querySelector('.leaflet-container') as HTMLElement;
        }
        this.shapeEditor = new ShapeEditor(this.lMap);
    }

    /**
     * マップがクリックされた時に実行されるonMapClick(メソッド型の変数)にaddSpotメソッドを代入
     * EditorToolBarコンポーネントでclickSpotイベントが発生した時に実行される
     * @param spotType クリックされたスポットの種類 (clickSpotイベントから送られてくる)
     */
    private setAddSpotMethodOnMapClick(spotType: SpotType): void {
        if (this.leafletContainer !== null) {
            this.leafletContainer.style.cursor = 'url(https://github.com/torimons/torimon/blob/create-shape-mode/src/assets/place-24px.cur?raw=true) 18 35, pointer ';
        }
        this.onMapClick = this.addSpot;
        this.spotTypeToAddNext = spotType;
    }

    /**
     * マップがクリックされた時に実行されるonMapClick(メソッド型の変数)に何も行わないundefinedを
     * セットし，クリック時に何も行われないようにする
     * EditorToolBarコンポーネントでclickSpotイベント以外が発生した時に実行される
     */
    private setDefaultMethodOnMapClick(): void {
        if (this.leafletContainer !== null) {
            this.leafletContainer.style.removeProperty('cursor');
        }
        this.onMapClick = (e: any) => {
            this.unfocusedMarker();
        };
    }

    /**
     * スポットを作成しマーカーをL.Mapに追加する
     * 作成するスポットのIDは既存のスポットのIDの中から最も大きい数値+1の値
     * @param e Leafletイベント(e.latlngを取得するためにany型にしている)
     */
    private addSpot(e: any): void {
        const maxNumOfId = this.map.getSpots()
            .map((spot) => spot.getId())
            .reduce((accum, newValue) => Math.max(accum, newValue), -1);
        const newId = maxNumOfId + 1;
        const newSpot: Spot = new Spot(
            newId, 'スポット ' + newId, e.latlng, undefined, undefined, undefined, undefined, this.spotTypeToAddNext,
        );
        this.map.addSpot(newSpot);

        const newMarker: SpotMarker = new SpotMarker(newSpot);
        newMarker.addTo(this.lMap);
        newMarker.on('click', (event) => this.switchFocusedMarker(event.target));
        this.spotMarkers.push(newMarker);

        this.switchFocusedMarker(newMarker);
    }

    private unfocusedMarker(): void {
        if (this.focusedSpot !== null) {
            const focusedMarker = this.spotMarkers
                .find(((marker) => marker.getSpot().getId() === (this.focusedSpot as Spot).getId()));
            focusedMarker?.setSelected(false);
        }
        this.focusedSpot = null;
    }

    /**
     * 地図上でフォーカスされるマーカーを切り替える
     * @param newMarker 新しくフォーカスされるマーカー
     */
    private switchFocusedMarker(newMarker: SpotMarker): void {
        this.unfocusedMarker();
        newMarker.setSelected(true);
        this.focusedSpot = newMarker.getSpot();
    }

    /**
     * フォーカスされているスポットをマップから消去する
     */
    private deleteFocusedSpot(): void {
        if (this.focusedSpot === null) {
            return;
        }
        const focusedSpot: Spot = this.focusedSpot;
        this.spotMarkers.find((marker) => marker.getSpot().getId() === focusedSpot.getId())?.remove();
        this.spotMarkers = this.spotMarkers
            .filter((marker) => marker.getSpot().getId() !== focusedSpot.getId());
        focusedSpot.getParentMap()?.removeSpot(focusedSpot.getId());
        this.shapeEditor.displayPolygons(this.map.getSpots());
        this.shapeEditor.removeShapeEditLine();
        this.shapeEditButtonIsVisible = false;
        this.setDefaultMethodOnMapClick();
        this.focusedSpot = null;
    }

    /**
     * フォーカスされている地図上のスポットマーカーの名前表示を更新する
     */
    private updateFocusedMarkerName(): void {
        if (this.focusedSpot === null) {
            return;
        }
        this.spotMarkers
            .find((marker) => marker.getSpot().getId() === (this.focusedSpot as Spot).getId())?.addTo(this.lMap);
    }

    /**
     * マップクリック時に実行される関数を，形状描画メソッドにする
     */
    private setAddPointMethodOnMapClick(): void {
        this.disabledShapeEditButtonInSpotEditor = true;
        if (this.leafletContainer !== null) {
            this.leafletContainer.style.cursor = 'crosshair';
        }
        this.shapeEditButtonIsVisible = true;
        this.onMapClick = (e: { latlng: L.LatLngExpression, afterAddEndPoint: (shape: Shape) => void }) => {
            /**
             * ラインの終点が描画された後に呼び出される関数
             * ポリゴンの描画や後処理を行う
             * @param shape ポリゴンの元となる描画情報
             */
            e.afterAddEndPoint = (shape: Shape) => {
                if (this.leafletContainer !== null) {
                    this.leafletContainer.style.removeProperty('cursor');
                }
                this.shapeEditButtonIsVisible = false;
                this.focusedSpot?.setShape(shape);
                this.shapeEditor.displayPolygons(this.map.getSpots());

                /**
                 * 始点のCircleMarkerがクリックされた場合に本コールバックメソッドは呼ばれるが,
                 * その直後に必ずmapのクリックイベントも発生するため，遅延を設けないと
                 * defaultMethodが勝手に呼ばれてしまう
                 * またこのメソッドが呼ばれる際のクリックをダブルクリックで行うと，
                 * 500ms以内にmapのクリックイベントが発生してしまいaddPointメソッドが呼ばれるので
                 * 500ms間の繋ぎとしてundefinedをセットしている
                 */
                this.onMapClick = (event: any) => undefined;
                setTimeout(this.setDefaultMethodOnMapClick, 500);
                this.disabledShapeEditButtonInSpotEditor = false;
            };
            this.shapeEditor.addPoint(e);
        };
    }

    /**
     * 編集ツールバーコンボーケントでモードが切り替わった際に実行される
     */
    private onSwitchModeOfToolBar() {
        this.shapeEditButtonIsVisible = false;
        this.shapeEditor.removeShapeEditLine();
        this.disabledShapeEditButtonInSpotEditor = false;
    }

    /**
     * マップを拡大する
     * EditorToolBarコンポーネントがclickZoomInイベントを発生させた時に実行される
     */
    private zoomIn() {
        this.lMap.zoomIn();
    }

    /**
     * マップを縮小する
     * EditorToolBarコンポーネントがclickZoomOutイベントを発生させた時に実行される
     */
    private zoomOut() {
        this.lMap.zoomOut();
    }

    /**
     * マップをクリックしたときに実行される
     * EditorToolBarからEmitされるイベントによって中身が切り替わる
     * デフォルトでは何もしない(undefined)
     * @param e Leafletイベント(addSpotメソッドでe.latlngを取得するためにany型にしている)
     */
    private onMapClick: (e: any) => void = (e: any) => undefined;
}
