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

@Component({
    components: {
        EditorToolBar,
        SpotEditor,
    },
})
export default class CreationMapView extends Vue {
    private lMap!: L.Map;
    private defaultZoomLevel: number = 17;
    private tileLayer!: L.TileLayer;
    private routeLayer?: L.Layer;
    private routeLine!: L.Polyline;
    private map: Map = new Map(0, 'New Map', {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    });
    // 次にクリックしたときに設置されるスポットタイプ
    private spotTypeToAddNext: SpotType = 'default';
    private spotEditorIsVisible: boolean = false;
    private focusedSpot: Spot = new Spot(0, '', { lat: 0, lng: 0});
    private spotMarkers: SpotMarker[] = [];
    private coordinates: Coordinate[] = [];

    /**
     * とりあえず地図の表示を行なっています．
     */
    public mounted() {
        // マップの範囲選択機能を実装していないので仮の範囲
        const rootMapCenter: Coordinate = Map.calculateCenter(mapViewGetters.rootMap.getBounds());
        this.lMap = L.map('map', {zoomControl: false})
            .setView([rootMapCenter.lat, rootMapCenter.lng], this.defaultZoomLevel);
        this.tileLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 23,
                maxNativeZoom: 19,
            },
        ).addTo(this.lMap);
        this.lMap.on('click', (e) => this.onMapClick(e));
    }

    /**
     * マップがクリックされた時に実行されるonMapClick(メソッド型の変数)にaddSpotメソッドを代入
     * EditorToolBarコンポーネントでclickSpotイベントが発生した時に実行される
     * @param spotType クリックされたスポットの種類 (clickSpotイベントから送られてくる)
     */
    private setAddSpotMethodOnMapClick(spotType: SpotType): void {
        this.onMapClick = this.addSpot;
        this.spotTypeToAddNext = spotType;
    }

    /**
     * マップがクリックされた時に実行されるonMapClick(メソッド型の変数)に何も行わないundefinedを
     * セットし，クリック時に何も行われないようにする
     * EditorToolBarコンポーネントでclickSpotイベント以外が発生した時に実行される
     */
    private setEmptyMethodOnMapClick(): void {
        this.onMapClick = (e: any) => {
            this.spotEditorIsVisible = false;
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

    /**
     * 地図上でフォーカスされるマーカーを切り替える
     * @param newMarker 新しくフォーカスされるマーカー
     */
    private switchFocusedMarker(newMarker: SpotMarker): void {
        const focusedMarker = this.spotMarkers
            .find(((marker) => marker.getSpot().getId() === this.focusedSpot.getId()));
        focusedMarker?.setSelected(false);
        newMarker.setSelected(true);
        this.focusedSpot = newMarker.getSpot();
        this.spotEditorIsVisible = true;
    }

    /**
     * フォーカスされているスポットをマップから消去する
     */
    private deleteFocusedSpot(): void {
        this.spotEditorIsVisible = false;
        this.spotMarkers.find((marker) => marker.getSpot().getId() === this.focusedSpot.getId())?.remove();
        this.spotMarkers = this.spotMarkers
            .filter((marker) => marker.getSpot().getId() !== this.focusedSpot.getId());
        this.focusedSpot.getParentMap()?.removeSpot(this.focusedSpot.getId());
    }

    /**
     * フォーカスされている地図上のスポットマーカーの名前表示を更新する
     */
    private updateFocusedMarkerName(): void {
        this.spotMarkers
            .find((marker) => marker.getSpot().getId() === this.focusedSpot.getId())?.addTo(this.lMap);
    }

    private setAddPointMethodOnMapClick(): void {
        this.onMapClick = this.addPoint;
    }

    private addPoint(e: any): void {
        this.coordinates.push(e.latlng);
        L.circleMarker(e.latlng, {
            radius: 4, weight: 1, color: 'black', fill: true, fillColor: 'white', fillOpacity: 1,
        }).addTo(this.lMap);
        if (this.coordinates.length > 0) {
            if (this.routeLine !== undefined) {
                this.routeLine.remove();
            }
            this.routeLine = L.polyline(this.coordinates, {
                color: '#555555',
                weight: 5,
                opacity: 0.7,
            });
            this.routeLine.addTo(this.lMap);
        }
    }

    private addEndPoint(e: any): void {
        this.coordinates.push(e.latlng);
        if (this.routeLine !== undefined) {
            this.routeLine.remove();
        }
        const coords: number[][][] = [this.coordinates.map((coordinate) => {
            return [coordinate.lat, coordinate.lng];
        })];
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
