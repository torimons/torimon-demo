import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapViewStore } from '@/store/modules/MapViewModule';
import { SpotForMap, Coordinate, Bounds, DisplayLevelType } from '@/store/types';
import { GeolocationWrapper } from '@/components/GeolocationWrapper.ts';
import 'leaflet/dist/leaflet.css';
import L, { LeafletEvent, TileLayer, map } from 'leaflet';
import { GeoJsonObject, GeometryObject, Feature, FeatureCollection } from 'geojson';
import store from '@/store';
import CurrentLocationMarker from '@/CurrentLocationMarker';
import DefaultSpotMarker from '@/DefaultSpotMarker';

@Component
export default class Map extends Vue {
    private map!: L.Map;
    private centerLat: number = 35;
    private centerLng: number = 139;
    private zoomLevel: number = 15;
    private tileLayer!: L.TileLayer;
    private polygonLayer?: L.GeoJSON<GeoJsonObject>; // 表示されるポリゴンのレイヤー
    private spotMarkers: L.Marker[] = [];
    private currentLocationMarker: CurrentLocationMarker = new CurrentLocationMarker([0, 0]);
    private zoomLevelThreshold: number = 19; // とりあえず仮で閾値決めてます
    private mapIdToDisplay: number = mapViewStore.rootMapId;

    /**
     * とりあえず地図の表示を行なっています．
     */
    public mounted() {
        this.centerLat = this.calculateCenter(mapViewStore.rootMapBounds).lat;
        this.centerLng = this.calculateCenter(mapViewStore.rootMapBounds).lng;
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

        // sampleMapのスポット表示
        const rootMapSpots = mapViewStore.getSpotsForMap(mapViewStore.rootMapId);
        this.displaySpotMarkers(rootMapSpots);

        // sampleMapのポリゴン表示
        // $nextTick()はテスト実行時のエラーを回避するために使用しています．
        this.$nextTick().then(() => {
            // 現状mapIdのgetterがないため直接指定しています．
            this.displayPolygons(mapViewStore.rootMapId);
        });
        this.currentLocationMarker.addTo(this.map);

        // マップのズームが変更された時のコールバック登録
        this.map.on('zoomend', this.updateDisplayLevel);
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
     * ズームレベルや階層が変更された際のマーカー表示切り替え
     * @param 新しく表示するスポットの配列
     */
    private displaySpotMarkers(spotsToDisplay: SpotForMap[]): void {
        // removeしてから取り除かないと描画から消えない
        this.spotMarkers.forEach((marker: L.Marker) => marker.remove());
        const coordinates: Coordinate[] = spotsToDisplay.map((spot: SpotForMap) => spot.coordinate);
        this.spotMarkers = coordinates.map((coord: Coordinate) => new DefaultSpotMarker(coord));
        this.addMarkersToMap(this.spotMarkers);
    }

    /**
     * マーカーをマップに追加する．単体テストでモックするためにdisplaySpotMarkersから分離
     * @param マップに追加するマーカーの配列
     */
    private addMarkersToMap(markersToAdd: L.Marker[]) {
        markersToAdd.map((marker: L.Marker) => marker.addTo(this.map));
    }

    /**
     * ズームレベルが変更された時にstateのdisplayLevelを更新する
     */
    private updateDisplayLevel(): void {
        const currentZoomLevel = this.map.getZoom();
        if (currentZoomLevel >= this.zoomLevelThreshold) {
            mapViewStore.setDisplayLevel('detail');
        } else {
            mapViewStore.setDisplayLevel('default');
        }
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
}
