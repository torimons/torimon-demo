import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';
import store from '@/store';
import { mapViewStore } from '@/store/modules/MapViewModule';
import { SpotForMap, Coordinate, Shape } from '@/store/types';
/*
leafletの導入
必要であればプラグインの導入
*/
import 'leaflet/dist/leaflet.css';
import L, { LeafletEvent, TileLayer } from 'leaflet';
import { GeoJsonObject, GeometryObject, Feature, FeatureCollection } from 'geojson';

@Component
export default class Map extends Vue {
    private map!: L.Map;
    private polygonLayer?: L.GeoJSON<GeoJsonObject>; // 表示されるポリゴンのレイヤー
    private edgeLayer?: any; // any型は仮
    private centerLat: number = 33.59;
    private centerLng: number = 130.21;
    private zoomLevel: number = 15;
    private tileLayer!: L.TileLayer;
    private defaultIcon = L.icon({
        iconUrl: 'http://localhost:8080/leaflet/marker-icon-2x.png',
        iconSize: [50, 82],
        iconAnchor: [25, 80],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
    });
    private markers: L.Marker[] = [];

    /**
     * とりあえず地図の表示を行なっています．
     */
    public mounted() {
        /*
            osmタイルの初期化
            表示するマップのタイルの表示
            現在地の取得と現在地周りの表示
            初期化時のマーカー表示
            初期化時のオブジェクト表示
            */
        this.map = L.map('map').setView(
            [this.centerLat, this.centerLng],
            this.zoomLevel,
        );
        this.tileLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 23,
                maxNativeZoom: 19,
            },
        ).addTo(this.map);

        this.markers = [L.marker([this.centerLat, this.centerLng], { icon: this.defaultIcon })];
        this.markers.map((marker: L.Marker) => marker.addTo(this.map));
        this.map.on('zoomstart', this.switchMarkers);
        // sampleMapのポリゴン表示
        // $nextTick()はテスト実行時のエラーを回避するために使用しています．
        this.$nextTick().then(() => {
            // 現状mapIdのgetterがないため直接指定しています．
            const mapId = 0;
            this.displayPolygons(mapId);
            // sampleNodeListの経路（エッジ）表示
            // 初期パラメータは適当に指定
            const startPointId: number = 0;
            const endPointId: number = 1;
            this.displayEdge(startPointId, endPointId);
        });
    }

    /** 現在のマーカー削除し，spotsの座標にマーカーを配置する
     * @param newSpots 新しく表示したいスポットの配列
     * @param callback スポットがクリックされた時に呼び出すコールバック
     */
    private replaceMarkersWith(newSpots: SpotForMap[], callback: (e: L.LeafletEvent) => void): void {
        const coordinates: Coordinate[] = newSpots.map(
            (spot: SpotForMap) => spot.coordinate,
        );
        // removeしてから取り除かないと描画から消えない
        this.markers.forEach((marker: L.Marker) => marker.remove());
        this.markers = coordinates.map((coord: Coordinate) => L.marker(coord, {icon: this.defaultIcon}));
        this.markers.map((marker: L.Marker) => marker.addTo(this.map).on('click', callback));
    }

    /** ズームレベルや階層が変更された際のマーカー表示切り替え
     * @param e 発火イベント
     */
    private switchMarkers(e: L.LeafletEvent): void {
        // 表示するスポット一覧を取得
        const focusedMapId: number = mapViewStore.focusedSpot.mapId;
        const spots: SpotForMap[] = mapViewStore.getSpotsForMap(focusedMapId);
        // 仮のコールバックを登録
        this.replaceMarkersWith(spots, () => {
            // do nothing
        });
    }

    // マーカーが押された際に呼び出される関数
    private updateFocusedMarker(e: Event): void {
        /*
            （vuexの状態更新も行う必要がある）
            押したマーカーのスポットの情報の取得
            ポップアップの表示
            */
    }

    /**
     * storeのgetSpotsForMapで取得したspotの情報から
     * shapeの情報を取り出してleafletで扱える形式に変換する．
     * @params storeのgetSpotsForMapの返り値.
     * @return geoJson形式のshapeデータ
     */
    private spotShapeToGeoJson(spots: SpotForMap[]): GeoJsonObject {
        const shapes: Feature[] = [];
        for (const spot of spots) {
            const shape = spot.shape as GeometryObject;
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
     * 指定されたIDを持つ地図のポリゴンを表示する
     * polygonLayerメンバを変更して表示内容を変える．
     * @params 地図のID
     */
    private displayPolygons(mapId: number): void {
        // すでに表示されているポリゴンがある場合は先に削除する
        if (this.polygonLayer !== undefined) {
            this.map.removeLayer(this.polygonLayer);
        }
        const spotForMap: SpotForMap[] = mapViewStore.getSpotsForMap(mapId);
        const shapeGeoJson: GeoJsonObject = this.spotShapeToGeoJson(spotForMap);
        this.polygonLayer = new L.GeoJSON(shapeGeoJson, {
            style: {
                color: '#555555',
                weight: 2,
                opacity: 0.1,
                fillColor: '#555555',
                fillOpacity: 0.3,
            },
        });
        this.map.addLayer(this.polygonLayer);
    }

    /**
     * 指定されたnode間の経路（edge）を表示する
     * @param startPointId: 始点
     * @param endPointId: 終点
     * 経路検索機能によって引数の変更が考えられる
     */
    private displayEdge(startPointId: number, endPointId: number): void {
        // 既に表示している経路がある場合は先に削除する
        if (this.edgeLayer !== undefined) {
            this.map.removeLayer(this.edgeLayer);
        }
        const nodesForMap: Coordinate[] = mapViewStore.getNodesForMap(startPointId, endPointId);
        this.edgeLayer = L.polyline(nodesForMap, {
            color: '#555555',
            weight: 5,
            opacity: 0.7,
        }).addTo(this.map);
    }
}
