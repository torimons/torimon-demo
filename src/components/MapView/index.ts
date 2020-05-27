import { Component, Vue, Watch} from 'vue-property-decorator';
import { mapViewGetters, mapViewMutations, store } from '@/store/newMapViewIndex.ts';
import { SpotForMap, Coordinate, Bounds, RawSpot, DisplayLevelType } from '@/store/types';
import 'leaflet/dist/leaflet.css';
import L, { Marker } from 'leaflet';
import { GeoJsonObject, GeometryObject, Feature, FeatureCollection } from 'geojson';
import { findNearest, getDistance } from 'geolib';
import { GeolibInputCoordinates } from 'geolib/es/types';
import CurrentLocationMarker from '@/components/MapView/Marker/CurrentLocationMarker';
import DefaultSpotMarker from '@/components/MapView/Marker/DefaultSpotMarker';
import { MapViewGetters } from '@/store/modules/NewMapViewModule/MapViewGetters';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot';


@Component
export default class MapView extends Vue {
    private map!: L.Map;
    private defaultZoomLevel: number = 17;
    private tileLayer!: L.TileLayer;
    private polygonLayer?: L.GeoJSON<GeoJsonObject>; // 表示されるポリゴンのレイヤー
    private routeLines?: L.Polyline[];
    private routeLayer?: L.Layer;
    private spotMarkers: DefaultSpotMarker[] = [];
    private currentLocationMarker: CurrentLocationMarker = new CurrentLocationMarker([0, 0]);
    private zoomLevelThreshold: number = 19; // とりあえず仮で閾値決めてます
    private mapIdToDisplay!: number;

    /**
     * とりあえず地図の表示を行なっています．
     */
    public mounted() {
        const rootMapCenter: Coordinate = this.calculateCenter(mapViewGetters.rootMap.getBounds());
        this.map = L.map('map').setView([rootMapCenter.lat, rootMapCenter.lng], this.defaultZoomLevel);
        this.tileLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 23,
                maxNativeZoom: 19,
            },
        ).addTo(this.map);
        this.map.on('zoomend', this.updateDisplayLevel);
        this.map.on('move', this.updateIdOfCenterSpotInRootMap);
        this.map.zoomControl.setPosition('bottomright');
        this.watchStoreForMoveMapCenter();
        this.watchStoreForDisplayMap();
        this.watchFocusedSpotChange();
        this.initMapDisplay();
    }

    /**
     * マップの初期の描画，モックするためにmountedから分離
     */
    private initMapDisplay(): void {
        // sampleMapのスポット表示
        const rootMapSpots: Spot[] = mapViewGetters.rootMap.getSpots();
        this.displaySpotMarkers(rootMapSpots);
        // sampleMapのポリゴン表示
        this.displayPolygons(rootMapSpots);
        this.currentLocationMarker.addTo(this.map);
        // マーカー以外のmapがクリックされた時の処理を登録
        this.map.on('click', this.onMapClick);
    }

    /**
     * マーカーの選択状態を解除してSpotInfoを非表示にする
     */
    private onMapClick(): void {
        // focusedSpotがある場合そのスポットを未選択に設定する
        const focusedSpot = mapViewGetters.focusedSpot;
        const focusedMarker = this.findMarker(focusedSpot);
        if (focusedMarker !== null) {
            focusedMarker.setSelected(false);
        }
        // SpotItemを非表示にする
        mapViewMutations.setSpotInfoIsVisible(false);
    }

    /**
     * mapIdとspotIdから現在表示されているマーカーのオブジェクトを取得する
     * 見つからない場合nullを返す
     * @param idInfo マーカーを取得したいspotの{mapId, spotId}
     * @returns 見つかったマーカーのオブジェクト | null
     */
    private findMarker(spot: Spot | undefined): DefaultSpotMarker | null {
        const foundMarker: DefaultSpotMarker | undefined = this.spotMarkers
            .find((marker) => {
                return marker.getIdInfo().mapId === idInfo.mapId && marker.getIdInfo().spotId === idInfo.spotId;
            });
        if (foundMarker === undefined) {
            return null;
        }
        return foundMarker;
    }

    /**
     * focusedSpotをwatchして選択されたマーカーの色変更を行う
     * 以前のfocusedSpotは非選択状態の色にする
     */
    private watchFocusedSpotChange(): void {
        store.watch(
            (state, getters: MapViewGetters) => [
                getters.focusedSpot,
            ],
            (value, oldValue) => {
                // 古いfocusedSpotを非選択状態にする
                // 表示するmapが変わった場合など，以前のfocusedMarkerが存在しない場合がある
                // valueとoldValueは配列なので[0]で渡している
                const oldSelectedMarker = this.findMarker(oldValue[0]);
                if (oldSelectedMarker != null) {
                    oldSelectedMarker.setSelected(false);
                }
                // 新しいfocusedSpotを選択状態にする
                const newSelectedMarker = this.findMarker(value[0]);
                if (newSelectedMarker != null) {
                    newSelectedMarker.setSelected(true);
                }
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

    /**
     * ズームレベルや階層が変更された際のマーカー表示切り替え
     * @param spotsToDisplay 新しく表示するスポットの配列
     */
    private displaySpotMarkers(spotsToDisplay: Spot[]): void {
        this.spotMarkers.map((marker: Marker<any>) => marker.remove());
        this.spotMarkers = spotsToDisplay
            .map((spot: Spot) => new DefaultSpotMarker(spot.getCoordinate(), spot.getName(), spot.parentMap.getId(), spot.getId()));
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
        const spots: Spot[] = mapViewGetters.rootMap.getSpots();
        const nearestSpot: Spot = this.getNearestSpot(centerPos, spots);
        // 距離のチェック
        const isNear: boolean = this.twoPointsIsNear(centerPos, nearestSpot.getCoordinate());
        if (isNear === true) {
            mapViewMutations.setCenterSpotInRootMap(nearestSpot);
        } else {
            mapViewMutations.setNonExistentOfCenterSpotInRootMap();
        }
    }

    /**
     * スポット群から基準点に最も近いスポットを返す．
     * @param point 基準点
     * @param spots 基準点と比較したいスポットの配列
     * @return nearestSpot 基準点に一番近いスポット
     */
    private getNearestSpot(basePoint: Coordinate, spots: Spot[]): Spot {
        const spotPositions: Coordinate[] = spots.map((s: Spot) => s.getCoordinate());
        const nearestSpotPos: GeolibInputCoordinates = findNearest(basePoint, spotPositions);
        const nearestSpotIndex: number = spots.findIndex((s: Spot) => s.getCoordinate() === nearestSpotPos);
        const nearestSpot: Spot = spots[nearestSpotIndex];
        return nearestSpot;
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
     * マップ表示の移動のためにStoreのgetterのウォッチを行う
     */
    //TODO: テストを書く
    private watchStoreForMoveMapCenter(): void {
        store.watch(
            (state, getters: MapViewGetters) => mapViewGetters.spotToDisplayInMapCenter,
            (spot, oldSpot) => {
                if(spot == null) {
                    return;
                }
                let zoomLevel = this.defaultZoomLevel;
                if (mapViewGetters.rootMap.hasSpot(spot)) {
                    zoomLevel = this.zoomLevelThreshold + 0.5;
                }
                const parentMap: Map | undefined = spot.getParentMap();
                if(parentMap !== undefined) {
                    const parentSpot: Spot | undefined = parentMap.getParentSpot();
                    if(parentSpot !== undefined) {
                        parentSpot.setLastViewedDetailMap(parentMap);
                    }
                }
                this.map.flyTo(spot.getCoordinate(), zoomLevel);
            },
        );
    };

    /**
     * マップ表示の更新のためにStoreのgetterのウォッチを行う
     */
    private watchStoreForDisplayMap(): void {
        const getSwitchedFloorMapId = (getters: MapViewGetters): number | null => {
            const centerSpotId = getters.idOfCenterSpotInRootMap;
            if (centerSpotId != null) {
                const centerSpot = { parentMapId: mapViewGetters.rootMapId, spotId: centerSpotId };
                if (getters.spotHasDetailMaps(centerSpot)) {
                    return getters.getLastViewedDetailMapId(centerSpot);
                }
            }
            return null;
        };
        store.watch(
            (state, getters: MapViewGetters) => [
                getters.displayLevel,
                getters.idOfCenterSpotInRootMap,
                getSwitchedFloorMapId(getters),
            ],
            (value, oldValue) => this.displayMap(),
        );
    }

    /**
     * マップを選択し，そのマップのスポットとポリゴンを表示する
     */
    private displayMap(): void {
        const newMapToDisplay = this.selectMapToDisplay();
        // 表示するマップのidが変わった時だけマーカー,ポリゴンの表示を行う
        if (newMapToDisplay !== this.mapIdToDisplay) {
            const newSpotsForDisplayMap: SpotForMap[] = mapViewGetters.getSpotsForMap(newMapToDisplay);
            this.displaySpotMarkers(newSpotsForDisplayMap);
            this.displayPolygons(newSpotsForDisplayMap);
        }
        this.mapIdToDisplay = newMapToDisplay;
    }

    /**
     * Storeを参照して新しく表示するマップのIDを選択する
     * @return 新しく表示するマップのID
     */
    private selectMapToDisplay(): number {
        const displayLevel: DisplayLevelType = mapViewGetters.displayLevel;
        if (displayLevel === 'default') {
            return mapViewGetters.rootMapId;
        }
        const centerSpotId: number | null = mapViewGetters.idOfCenterSpotInRootMap;
        if (centerSpotId === null) {
            return mapViewGetters.rootMapId;
        }
        const centerSpot = { parentMapId: mapViewGetters.rootMapId, spotId: centerSpotId };
        if (!mapViewGetters.spotHasDetailMaps(centerSpot)) {
            return mapViewGetters.rootMapId;
        }
        const lastViewedDetailMapId: number | null = mapViewGetters.getLastViewedDetailMapId(centerSpot);
        if (lastViewedDetailMapId != null) {
            return lastViewedDetailMapId;
        }
        const firstDetailMapId: number = mapViewGetters.getSpotById(centerSpot).detailMapIds[0];
        return firstDetailMapId;
    }
}
