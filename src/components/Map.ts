import { Component, Vue } from 'vue-property-decorator';
import { mapViewStore, MapViewModule } from '@/store/modules/MapViewModule';
import { SpotForMap, Coordinate, Bounds } from '@/store/types';
import { GeolocationWrapper } from '@/components/GeolocationWrapper.ts';
import 'leaflet/dist/leaflet.css';
import L, { LeafletEvent, TileLayer, Polyline } from 'leaflet';
import { GeoJsonObject, GeometryObject, Feature, FeatureCollection } from 'geojson';
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
    private routeLines?: L.Polyline[];
    private routeLayer?: L.Layer;
    private defaultSpotIcon: L.Icon = L.icon({
        iconUrl: 'http://localhost:8081/leaflet/icons/marker-icon-2x.png',
        iconSize: [50, 82],
        iconAnchor: [25, 80],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
        className: 'spot',
    });
    private currentLocationIcon: L.Icon = L.icon({
        iconUrl: 'http://localhost:8081/leaflet/icons/currentLocation.png',
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, 0],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
        className: 'currentLocation',
    });
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

        const rootMapSpots: SpotForMap[] = mapViewStore.getSpotsForMap(mapViewStore.rootMapId);
        this.replaceMarkersWith(rootMapSpots);
        // sampleMapのポリゴン表示
        // $nextTick()はテスト実行時のエラーを回避するために使用しています．
        this.$nextTick().then(() => {
            // 現状mapIdのgetterがないため直接指定しています．
            this.displayPolygons(mapViewStore.rootMapId);
            // 経路（エッジ）表示
            this.displayRouteLines(mapViewStore.getNodesForNavigation([]));
            // 経路レイヤーが消去されているか確認
            // this.routeLines = this.displayRouteLines([]);
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
     * 現在のマーカー削除し，spotsの座標にマーカーを配置する
     * @param newSpots 新しく表示したいスポットの配列
     * @param callback スポットがクリックされた時に呼び出すコールバック
     */
    private replaceMarkersWith(newSpots: SpotForMap[]): void {
        const coordinates: Coordinate[] = newSpots.map(
            (spot: SpotForMap) => spot.coordinate,
        );
        // removeしてから取り除かないと描画から消えない
        this.spotMarkers.forEach((marker: L.Marker) => marker.remove());
        this.spotMarkers = coordinates.map((coord: Coordinate) => new DefaultSpotMarker(coord));
        this.spotMarkers.map((marker: L.Marker) => marker.addTo(this.map));
    }

    /**
     * ズームレベルや階層が変更された際のマーカー表示切り替え
     * @param e 発火イベント
     */
    private switchMarkers(e: L.LeafletEvent): void {
        // ズームレベルや階層が変更された際のマーカー表示切り替え
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
     * 指定された経由地の配列を受け取りを経路として表示する
     * @param wayPoints: 2点間の経路の経由地（配列）の配列
     */
    private displayRouteLines(wayPoints: Coordinate[][]): void {
        if (this.routeLayer !== undefined) {
            this.map.removeLayer(this.routeLayer);
        }
        this.routeLines = wayPoints.map((wayPoint: Coordinate[]) => (L.polyline(wayPoint, {
                color: '#555555',
                weight: 5,
                opacity: 0.7,
            })));
        this.routeLayer = L.layerGroup(this.routeLines);
        this.addRouteToMap(this.routeLayer);
    }

    /**
     * 経路をmapに追加する
     * @param routeLayer: mapに追加する経路のレイヤー
     */
    private addRouteToMap(routeLayer: L.Layer): void {
        this.map.addLayer(routeLayer);
    }
}
