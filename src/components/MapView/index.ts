import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapViewGetters, mapViewMutations, store } from '@/store';
import { Coordinate, Bounds, DisplayLevelType } from '@/store/types';
import 'leaflet/dist/leaflet.css';
import L, { Marker } from 'leaflet';
import { GeoJsonObject, GeometryObject, Feature, FeatureCollection } from 'geojson';
import { findNearest, getDistance } from 'geolib';
import { GeolibInputCoordinates } from 'geolib/es/types';
import CurrentLocationMarker from '@/components/MapView/Marker/CurrentLocationMarker';
import SpotMarker from '@/components/MapView/Marker/SpotMarker';
import { MapViewGetters } from '@/store/modules/MapViewModule/MapViewGetters';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot';
import ShapeEditor from '../CreationMapView/ShapeEditor';


@Component
export default class MapView extends Vue {
    private map!: L.Map;
    private defaultZoomLevel: number = 17;
    private tileLayer!: L.TileLayer;
    private polygonLayer?: L.GeoJSON<GeoJsonObject>; // 表示されるポリゴンのレイヤー
    private spotMarkers: SpotMarker[] = [];
    private currentLocationMarker: CurrentLocationMarker = new CurrentLocationMarker([0, 0]);
    private zoomLevelThreshold: number = 19; // とりあえず仮で閾値決めてます
    private mapToDisplay!: Map;
    private displayOSM: boolean = true;
    private shapeEditor!: ShapeEditor;

    /**
     * とりあえず地図の表示を行なっています．
     */
    public mounted() {
        const rootMapCenter: Coordinate = mapViewGetters.rootMap.getCenter();
        this.map = L.map('map', { zoomControl: false })
            .setView([rootMapCenter.lat, rootMapCenter.lng], this.defaultZoomLevel);
        const bounds = mapViewGetters.rootMap.getBounds();
        const lBounds = new L.LatLngBounds(bounds.topL, bounds.botR);
        this.defaultZoomLevel = this.map.getBoundsZoom(lBounds, false);
        this.zoomLevelThreshold = this.defaultZoomLevel + 2;
        this.map.setMaxBounds(new L.LatLngBounds(
            {
                lat: lBounds.getNorthWest().lat + 1,
                lng: lBounds.getNorthWest().lng - 1,
            },
            {
                lat: lBounds.getSouthEast().lat - 1,
                lng: lBounds.getSouthEast().lng + 1,
            },
        ));
        this.map.setMinZoom(this.defaultZoomLevel - 1);
        this.map.setZoom(this.defaultZoomLevel);
        this.tileLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 23,
                maxNativeZoom: 19,
            },
        ).addTo(this.map);
        this.map.on('zoomend', this.updateDisplayLevel);
        this.map.on('move', this.updateCenterSpotInRootMap);
        // this.map.zoomControl.setPosition('bottomright');
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
        this.shapeEditor = new ShapeEditor(this.map);
        this.shapeEditor.drawRectangle(mapViewGetters.rootMap.getBounds());
    }

    /**
     * マーカーの選択状態を解除してSpotInfoを非表示にする
     */
    private onMapClick(): void {
        // SpotItemを非表示にする
        mapViewMutations.setSpotInfoIsVisible(false);
        // focusedSpotがある場合そのスポットを未選択に設定する
        const focusedSpot = mapViewGetters.focusedSpot;
        if (focusedSpot === undefined) {
            return;
        }
        const focusedMarker = this.findMarker(focusedSpot.getId());
        if (focusedMarker !== null) {
            focusedMarker.setSelected(false);
        }
    }

    /**
     * 現在表示されているマーカーからspotIdをもとに検索
     * 見つからない場合nullを返す
     * @param spotId 検索したいマーカーのスポットID
     * @returns 見つかったマーカーのオブジェクト | null
     */
    private findMarker(spotId: number): SpotMarker | null {
        const foundMarker: SpotMarker | undefined = this.spotMarkers
            .find((marker) => {
                return marker.getSpot().getId() === spotId;
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
            (state, getters: MapViewGetters) => getters.focusedSpot,
            (value, oldValue) => {
                // 古いfocusedSpotを非選択状態にする
                // 表示するmapが変わった場合など，以前のfocusedMarkerが存在しない場合がある
                // valueとoldValueは配列なので[0]で渡している
                if (oldValue !== undefined) {
                    const oldSelectedMarker = this.findMarker(oldValue.getId());
                    if (oldSelectedMarker != null) {
                        oldSelectedMarker.setSelected(false);
                    }
                }
                // 新しいfocusedSpotを選択状態にする
                if (value !== undefined) {
                    const newSelectedMarker = this.findMarker(value.getId());
                    if (newSelectedMarker != null) {
                        newSelectedMarker.setSelected(true);
                    }
                }
            },
        );
    }

    /**
     * ズームレベルや階層が変更された際のマーカー表示切り替え
     * @param spotsToDisplay 新しく表示するスポットの配列
     */
    private displaySpotMarkers(spotsToDisplay: Spot[]): void {
        this.spotMarkers.forEach((marker: Marker<any>) => marker.remove());
        this.spotMarkers = spotsToDisplay
            .map((spot: Spot) => new SpotMarker(spot));
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
     * マップ移動時に画面中央に最も近い&ある一定距離以内に存在するスポットをcenterSpotInRootMapにセットする．
     * 一定距離内であればスポットを，一定距離外であればnullをセット．距離の判定はtwoPointsIsNearが行う．
     * @params e leafletのイベント
     */
    private updateCenterSpotInRootMap(e: L.LeafletEvent): void {
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
    private watchStoreForMoveMapCenter(): void {
        store.watch(
            (state, getters: MapViewGetters) => getters.spotToDisplayInMapCenter,
            (spot, oldSpot) => {
                if (spot === null) {
                    return;
                }
                let zoomLevel = this.defaultZoomLevel;
                if (!mapViewGetters.rootMap.hasSpot(spot)) {
                    zoomLevel = this.zoomLevelThreshold + 1;
                }
                const parentMap: Map | undefined = spot.getParentMap();
                if (parentMap !== undefined) {
                    const parentSpot: Spot | undefined = parentMap.getParentSpot();
                    if (parentSpot !== undefined) {
                        parentSpot.setLastViewedDetailMap(parentMap);
                    }
                }
                this.map.flyTo(spot.getCoordinate(), zoomLevel);
            },
        );
    }

    /**
     * マップ表示の更新のためにStoreのgetterのウォッチを行う
     */
    private watchStoreForDisplayMap(): void {
        const getSwitchedFloorMap = (getters: MapViewGetters): Map | undefined => {
            const centerSpot = getters.centerSpotInRootMap;
            if (centerSpot !== null) {
                if (centerSpot.getDetailMaps().length > 0) {
                    return centerSpot.getLastViewedDetailMap();
                }
            }
            return undefined;
        };
        store.watch(
            (state, getters: MapViewGetters) => [
                getters.displayLevel,
                getters.centerSpotInRootMap,
                getSwitchedFloorMap(getters),
            ],
            (value, oldValue) => this.displayMap(),
        );
    }

    /**
     * マップを選択し，そのマップのスポットとポリゴンを表示する
     */
    private displayMap(): void {
        const newMapToDisplay = this.selectMapToDisplay();
        // 表示するマップが変わった時だけマーカー,ポリゴンの表示を行う
        if (newMapToDisplay !== this.mapToDisplay) {
            const newSpotsForDisplayMap: Spot[] = newMapToDisplay.getSpots();
            this.displaySpotMarkers(newSpotsForDisplayMap);
            this.displayPolygons(newSpotsForDisplayMap);
        }
        this.mapToDisplay = newMapToDisplay;
    }

    /**
     * Storeを参照して新しく表示するマップを選択する
     * @return 新しく表示するマップ
     */
    private selectMapToDisplay(): Map {
        const displayLevel: DisplayLevelType = mapViewGetters.displayLevel;
        if (displayLevel === 'default') {
            return mapViewGetters.rootMap;
        }
        const centerSpot: Spot | null = mapViewGetters.centerSpotInRootMap;
        if (centerSpot === null) {
            return mapViewGetters.rootMap;
        }
        if (centerSpot.getDetailMaps().length === 0) {
            return mapViewGetters.rootMap;
        }
        const lastViewedDetailMap: Map | undefined = centerSpot.getLastViewedDetailMap();
        if (lastViewedDetailMap !== undefined) {
            return lastViewedDetailMap;
        }
        const firstDetailMap: Map = centerSpot.getDetailMaps()[0];
        return firstDetailMap;
    }

    /**
     * diplayOSMの変更を検知してleafletのmapからtileLayerのON/OFFを行う
     */
    @Watch('displayOSM')
    private onDisplayOSMChange() {
        if (this.displayOSM) {
            this.tileLayer.setUrl('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
        } else {
            this.tileLayer.setUrl('');
        }
    }

    /**
     * zoom_inボタンを押した時にzoominする
     */
    private zoomIn() {
        this.map.zoomIn();
    }

    /**
     * zoom_outボタンを押した時にzoomoutする
     */
    private zoomOut() {
        this.map.zoomOut();
    }
}
