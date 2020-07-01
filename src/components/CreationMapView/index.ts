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
    private routeLine: L.Polyline | null = null;
    private circleMarkers: L.CircleMarker[] = [];
    private polygonLayer?: L.GeoJSON<GeoJsonObject>; // 表示されるポリゴンのレイヤー
    private controlLayer: L.Control.Layers = L.control.layers({}, {});
    private leafletContainer!: HTMLElement | null;
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
        const pane = this.lMap.createPane("markerPane");
        pane.style.zIndex = '620';
        if(document.querySelector('.leaflet-container') !== null) {
            this.leafletContainer = document.querySelector('.leaflet-container') as HTMLElement;
        }
    }

    /**
     * マップがクリックされた時に実行されるonMapClick(メソッド型の変数)にaddSpotメソッドを代入
     * EditorToolBarコンポーネントでclickSpotイベントが発生した時に実行される
     * @param spotType クリックされたスポットの種類 (clickSpotイベントから送られてくる)
     */
    private setAddSpotMethodOnMapClick(spotType: SpotType): void {
        if(this.leafletContainer !== null) {
            this.leafletContainer.style.cursor = 'url(https://github.com/torimons/torimon/blob/95f7cf4c08609b3158296f06ab4339e28c2282be/src/assets/place-24px.cur?raw=true) 18 35, pointer';
        }
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
        if(this.leafletContainer !== null) {
            this.leafletContainer.style.cursor = 'crosshair';
        }
        this.onMapClick = this.addPoint;
    }

    private addPoint(e: any): void {
        this.coordinates.push(e.latlng);

        const circleMarker: L.CircleMarker = L.circleMarker(e.latlng, {
            pane: 'markerPane', radius: 6, weight: 1, color: 'black', fill: true, fillColor: 'white', fillOpacity: 1,
        });
        if(this.circleMarkers.length === 0) {
            circleMarker.on('click', this.addEndPoint);
        }
        circleMarker.addTo(this.lMap);
        this.circleMarkers.push(circleMarker)

        if (this.coordinates.length > 1) {
            if (this.routeLine !== null) {
                console.log(this.routeLine);
                this.routeLine.remove();
                this.controlLayer.removeLayer(this.routeLine);
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
        if(this.leafletContainer !== null) {
            this.leafletContainer.style.removeProperty('cursor');
        }
        this.setEmptyMethodOnMapClick();
        this.coordinates.push(this.coordinates[0]);
        if (this.routeLine !== null) {
            this.routeLine.remove();
            this.routeLine = null;
        }
        this.circleMarkers.forEach((marker) => marker.remove());
        this.circleMarkers = [];
        const coords: number[][][] = [this.coordinates.map((coordinate) => {
            return [coordinate.lng, coordinate.lat];
        })];
        const shape: Shape = {
            type: 'Polygon',
            coordinates: coords,
        };
        this.focusedSpot.setShape(shape);
        this.displayPolygons(this.map.getSpots());
        this.coordinates = [];
    }

    /**
     * spotの情報からshapeの情報を取り出してleafletで扱える形式に変換する．
     * @param spots GeoJson形式に変換したいspotの配列 .
     * @return GeoJson形式のshapeデータ
     */
    private spotShapeToGeoJson(spots: Spot[]): GeoJsonObject {
        const shapes: Feature[] = [];
        for (const spot of spots) {
            const shape = spot.getShape() as GeometryObject;
            const feature: Feature = {
                properties: {},
                type: 'Feature',
                geometry: shape,
            };
            shapes.push(feature);
        }
        const features: FeatureCollection = {
            type: 'FeatureCollection',
            features: shapes,
        };
        return features as GeoJsonObject;
    }

    /**
     * 指定されたスポットのポリゴンを表示する
     * polygonLayerメンバを変更して表示内容を変える．
     * @param spotsForDisplay 表示するスポットの配列
     */
    private displayPolygons(spotsForDisplay: Spot[]): void {
        console.log(spotsForDisplay);
        // すでに表示されているポリゴンがある場合は先に削除する
        if (this.polygonLayer !== undefined) {
            this.lMap.removeLayer(this.polygonLayer);
        }
        const shapeGeoJson: GeoJsonObject = this.spotShapeToGeoJson(spotsForDisplay);
        this.polygonLayer = new L.GeoJSON(shapeGeoJson, {
            style: {
                color: '#555555',
                weight: 2,
                opacity: 0.1,
                fillColor: '#555555',
                fillOpacity: 0.3,
            },
        });
        this.lMap.addLayer(this.polygonLayer);
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
