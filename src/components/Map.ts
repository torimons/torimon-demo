import { Component, Vue } from 'vue-property-decorator';
import { mapViewStore } from '@/store/modules/MapViewModule';
import { SpotForMap, Coordinate, Bounds } from '@/store/types';
import { GeolocationWrapper } from '@/components/GeolocationWrapper.ts';
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
    private defaultSpotIcon: L.Icon = L.icon({
        iconUrl: 'https://github.com/torimons/torimon/blob/master/public/leaflet/icons/marker-icon-2x.png?raw=true',
        iconSize: [50, 82],
        iconAnchor: [25, 80],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
        className: 'spot',
    });
    private currentLocationIcon: L.Icon = L.icon({
        iconUrl: 'https://github.com/torimons/torimon/blob/master/public/leaflet/icons/currentLocation.png?raw=true',
        iconSize: [40, 40],
        iconAnchor: [25, 25],
        popupAnchor: [0, 0],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
        className: 'currentLocation',
    });
    private spotMarkers: L.Marker[] = [];
    private currentLocationMarker: L.Marker = L.marker([0, 0], { icon: this.currentLocationIcon });
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
        this.replaceMarkersWith(rootMapSpots, this.defaultSpotIcon, () => { /*何もしない*/ });
        // sampleMapのポリゴン表示
        // $nextTick()はテスト実行時のエラーを回避するために使用しています．
        this.$nextTick().then(() => {
            // 現状mapIdのgetterがないため直接指定しています．
            this.displayPolygons(mapViewStore.rootMapId);
        });
        this.currentLocationMarker.addTo(this.map);
        this.bindMarkerToCurrentPosition(this.currentLocationMarker);

        // マップのズームが変更された時のコールバック登録
        this.map.on('zoomend', this.updateDisplayLevel);
    }

    /**
     * マーカーがデバイスの現在位置に常に表示されるようにする
     * @param marker 現在位置に表示し続けたいマーカーオブジェクト
     */
    private bindMarkerToCurrentPosition(marker: L.Marker): number {
        return GeolocationWrapper.watchPosition(
            (pos: Position) => {
                marker.setLatLng(
                    [pos.coords.latitude, pos.coords.longitude],
                );
            },
            (error: PositionError) => {
                throw error;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000, // milliseconds
                maximumAge: 0, // 0 = the device cannot use a cached position
            },
        );
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

    /** 現在のマーカー削除し，spotsの座標にマーカーを配置する
     * @param newSpots 新しく表示したいスポットの配列
     * @param callback スポットがクリックされた時に呼び出すコールバック
     */
    private replaceMarkersWith(newSpots: SpotForMap[], icon: L.Icon, callback: (e: L.LeafletEvent) => void): void {
        const coordinates: Coordinate[] = newSpots.map(
            (spot: SpotForMap) => spot.coordinate,
        );
        // removeしてから取り除かないと描画から消えない
        this.spotMarkers.forEach((marker: L.Marker) => marker.remove());
        this.spotMarkers = coordinates.map((coord: Coordinate) => L.marker(coord, {icon}));
        this.spotMarkers.map((marker: L.Marker) => marker.addTo(this.map).on('click', callback));
    }

    /** ズームレベルや階層が変更された際のマーカー表示切り替え
     * @param e 発火イベント
     */
    private switchMarkers(e: L.LeafletEvent): void {
        // ズームレベルや階層が変更された際のマーカー表示切り替え
    }

    /** ズームレベルが変更された時にstateのdisplayLevelを更新する
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
}
