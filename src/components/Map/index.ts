import { Component, Vue, Watch} from 'vue-property-decorator';
import { mapViewGetters, mapViewMutations, store } from '@/store';
import { SpotForMap, Coordinate, Bounds, Spot } from '@/store/types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoJsonObject, GeometryObject, Feature, FeatureCollection } from 'geojson';
import { findNearest, getDistance } from 'geolib';
import { GeolibInputCoordinates } from 'geolib/es/types';
import CurrentLocationMarker from '@/components/Map/Marker/CurrentLocationMarker';
import DefaultSpotMarker from '@/components/Map/Marker/DefaultSpotMarker';
import { MapViewGetters } from '@/store/modules/MapViewModule/MapViewGetters';


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
    private spotMarkers: L.Marker[] = [];
    private currentLocationMarker: CurrentLocationMarker = new CurrentLocationMarker([0, 0]);
    private zoomLevelThreshold: number = 19; // とりあえず仮で閾値決めてます
    private mapIdToDisplay: number = mapViewGetters.rootMapId;

    /**
     * とりあえず地図の表示を行なっています．
     */
    public mounted() {
        const rootMapCenter: Coordinate = this.calculateCenter(mapViewGetters.rootMapBounds);
        this.centerLat = rootMapCenter.lat;
        this.centerLng = rootMapCenter.lng;
        this.map = L.map('map').setView([this.centerLat, this.centerLng], this.zoomLevel);
        this.tileLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 23,
                maxNativeZoom: 19,
            },
        ).addTo(this.map);
        this.map.on('zoomend', this.updateDisplayLevel);
        this.map.on('move', this.updateIdOfCenterSpotInRootMap);
        this.map.zoomControl.setPosition('bottomright');
        store.watch(
            (state, getters: MapViewGetters) => mapViewGetters.mapCenterPositionToFocus,
            (value, oldValue) => this.map.setView(value, this.zoomLevel),
        );
        this.initMapDisplay();
    }

    /**
     * マップの初期の描画，モックするためにmountedから分離
     */
    private initMapDisplay(): void {
        // sampleMapのスポット表示
        const rootMapSpots: SpotForMap[] = mapViewGetters.getSpotsForMap(mapViewGetters.rootMapId);
        this.displaySpotMarkers(rootMapSpots);
        // sampleMapのポリゴン表示
        this.displayPolygons(rootMapSpots);
        this.currentLocationMarker.addTo(this.map);
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
     * @param spotsToDisplay 新しく表示するスポットの配列
     */
    private displaySpotMarkers(spotsToDisplay: SpotForMap[]): void {
        this.spotMarkers = spotsToDisplay.
            map((spot: SpotForMap) => new DefaultSpotMarker(spot.coordinate, spot.mapId, spot.spotId));
        this.addMarkersToMap(this.spotMarkers);
    }

    /**
     * マーカーをマップに追加する．単体テストでモックするためにdisplaySpotMarkersから分離
     * @param markersToAdd マップに追加するマーカーの配列
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
            mapViewMutations.setDisplayLevel('detail');
        } else {
            mapViewMutations.setDisplayLevel('default');
        }
    }

    /**
     * マップ移動時に画面中央に最も近い&ある一定距離以内に存在するスポットをidOfCenterSpotInRootMapにセットする．
     * 一定距離内であればスポットIdを，一定距離外であればnullをセット．距離の判定はtwoPointsIsNearが行う．
     * @params e leafletのイベント
     */
    private updateIdOfCenterSpotInRootMap(e: L.LeafletEvent): void {
        const centerPos: Coordinate = this.map.getCenter();
        const mapIndex: number = mapViewGetters.maps.findIndex((m) => m.id === mapViewGetters.rootMapId);
        const spots: Spot[] = mapViewGetters.maps[mapIndex].spots;
        const nearestSpotId: number = this.getNearestSpotId(centerPos, spots);
        // 距離のチェック
        const isNear: boolean = this.twoPointsIsNear(centerPos, spots[nearestSpotId].coordinate);
        if (isNear === true) {
            mapViewMutations.setIdOfCenterSpotInRootMap(nearestSpotId);
        } else {
            mapViewMutations.setNonExistentOfCenterSpotInRootMap();
        }
    }

    /**
     * スポット群から基準点に最も近いスポットのIdを返す．
     * @param point 基準点
     * @param spots 基準点と比較したいスポットの配列
     * @return nearestSpotId 基準点に一番近いスポットのId
     */
    private getNearestSpotId(basePoint: Coordinate, spots: Spot[]): number {
        const spotPositions: Coordinate[] = spots.map((s: Spot) => s.coordinate);
        const nearestSpotPos: GeolibInputCoordinates = findNearest(basePoint, spotPositions);
        const nearestSpotIndex: number = spots.findIndex((s: Spot) => s.coordinate === nearestSpotPos);
        const nearestSpotId: number = spots[nearestSpotIndex].id;
        return nearestSpotId;
    }

    /**
     * 2点間の距離のチェックを行い，閾値以下（近い）ならばtrue,閾値より大きい（遠い）ならばfalseを返す.
     * 距離の単位はメートル．
     * @param pointA 距離チェックを行いたい座標
     * @param pointB 距離チェックを行いたい座標
     */
    private twoPointsIsNear(pointA: Coordinate, pointB: Coordinate): boolean {
        const distanceThreshold: number = 200;
        const distance = getDistance(pointA, pointB);
        if (distance <= distanceThreshold) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * storeのgetSpotsForMapで取得したspotの情報から
     * shapeの情報を取り出してleafletで扱える形式に変換する．
     * @param spots storeのgetSpotsForMapの返り値.
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
     * 指定されたスポットのポリゴンを表示する
     * polygonLayerメンバを変更して表示内容を変える．
     * @param spotsForDisplay 表示するスポットの配列
     */
    private displayPolygons(spotsForDisplay: SpotForMap[]): void {
        // すでに表示されているポリゴンがある場合は先に削除する
        if (this.polygonLayer !== undefined) {
            this.map.removeLayer(this.polygonLayer);
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
