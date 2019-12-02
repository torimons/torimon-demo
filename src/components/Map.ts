import { Component, Prop, Vue } from 'vue-property-decorator';
import store from '../store';
import { mapState } from 'vuex';
import { SpotForMap, Shape, Bounds, Coordinate } from '../store/types';
import { mapViewStore } from '@/store/modules/MapViewModule';
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
    private centerLat: number = 35;
    private centerLng: number = 139;
    private zoomLevel: number = 15;
    private tileLayer!: L.TileLayer;
    private polygonLayer?: L.GeoJSON<GeoJsonObject>; // 表示されるポリゴンのレイヤー

    /**
     * とりあえず地図の表示を行なっています．
     */
    public mounted() {
        this.centerLat = this.calculateCenter(mapViewStore.rootMapBounds).lat;
        this.centerLng = this.calculateCenter(mapViewStore.rootMapBounds).lng;
        this.map = L.map('map').setView([this.centerLat, this.centerLng], this.zoomLevel);
        this.tileLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                maxZoom: 23,
                maxNativeZoom: 19,
            },
        ).addTo(this.map);

        this.displayPolygons(mapViewStore.rootMapId);
    }

    /**
     * 地図上の範囲から中心の座標を計算
     * @param bounds 中心座標を計算したい地図の範囲
     * @return 中心座標
     */
    private calculateCenter(bounds: Bounds): Coordinate {
        const centerLat = (bounds.topL.lat + bounds.botR.lat) / 2;
        const centerLng = (bounds.topL.lng + bounds.botR.lng) / 2;
        return { lat: centerLat, lng: centerLng };
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

    // ズームレベルや階層が変更された際のマーカー表示切り替え
    private switchMarkers(e: Event): void {
        /*
        現在表示されてるマーカーの削除
        階層やズームレベルの取得
        マーカーの再表示
        */
       }

    // マーカーが押された際に呼び出される関数
    private updateFocusedMarker(e: Event): void {
        /*
        （vuexの状態更新も行う必要がある）
        押したマーカーのスポットの情報の取得
        ポップアップの表示
        */
       }

    // ズームレベルや階層が変更された際のオブジェクトの表示切り替え
    // Event型だとイベントリスナーとして登録できなかったため，一旦anyにしています．
    private switchPolygon(e: any): void {
        /*
        現在表示されているオブジェクトの削除
        階層やズームレベルの取得
        オブジェクトの再表示
        */
        const zoomLevel: number = this.map.getZoom();
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
}
