import { Mutation, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '@/store';
import { MapViewState, Map, Spot, SpotInfo, SpotForMap, Bounds, DisplayLevelType, Coordinate, Node } from '@/store/types';
import { sampleMaps } from '@/store/modules/sampleMaps';
import { NoDetailMapsError } from '../errors/NoDetailMapsError';
import { NoDetailMapIdInSpotError } from '../errors/NoDetailMapIdInSpotError';
import { MapNotFoundError } from '../errors/MapNotFoundError';
import { SpotNotFoundError } from '../errors/SpotNotFoundError';

/**
 * マップ配列から,マップIdとスポットIdで指定されたスポットを取得する
 * @param maps MapViewModuleのマップ配列
 * @param targetSpot マップIdとスポットIdのオブジェクト
 * @throw MapNotFoundError 指定されたマップが見つからない場合に発生
 * @throw SpotNotFoundError 指定されたスポットが見つからない場合に発生
 */
function getSpotById(maps: Map[], targetSpot: {parentMapId: number, spotId: number}): Spot {
    const map: Map | undefined = maps.find((m: Map) => m.id === targetSpot.parentMapId);
    if (map === undefined) {
        throw new MapNotFoundError('Map does not found...');
    }
    const spot: Spot | undefined = map.spots.find((s: Spot) => s.id === targetSpot.spotId);
    if (spot === undefined) {
        throw new SpotNotFoundError('Spot does not found...');
    }
    return spot;
}

/**
 * MapViewの状態管理を行うVuexModuleクラス
 */
@Module({ dynamic: true, store, name: 'mapView', namespaced: true })
export class MapViewModule extends VuexModule implements MapViewState {

    /**
     * 複数のマップの情報を持つ
     * - 大元の地図と各スポットの持つ
     *   詳細地図(ピンチインで出てくるやつ)など含む
     * - 単体テスト以外の目視テスト等のために
     *   外部モジュールのsampleMapsで初期化
     * 将来的にはvuexのmutationで登録する
     */
    public maps: Map[] = sampleMaps;

    /*
     * 大元の親のMapのID
     */
    public rootMapId: number = 0;

    /**
     * Mapコンポーネントで選択されているMap，およびスポットのID
     */
    public focusedSpot: {mapId: number, spotId: number} = {
        mapId: 0,
        spotId: 0,
    };

    /**
     * SpotInfoコンポーネントの表示非表示状態を保持
     */
    public spotInfoIsVisible: boolean = false;

    /**
     * - 画面上で表示されている
     * - 半径〇〇内で最も画面中央に近い
     * - 詳細マップを持っている
     * スポットのIDを保持する変数
     * 条件に当てはまるスポットがない場合nullを持つ
     */
    public idOfCenterSpotInRootMap: number | null = null;

    /**
     * ズームレベルに応じて切り替わる表示レベルを保持
     */
    public displayLevel: DisplayLevelType = 'default';

    /**
     * Mapコンポーネントが扱うマップの範囲を返す
     * @return マップの範囲
     */
    get rootMapBounds(): Bounds {
        const rootMapIndex: number = this.maps.findIndex((m: Map) => m.id === this.rootMapId);
        return this.maps[rootMapIndex].bounds;
    }

    /**
     * Mapコンポーネントがアイコン表示のために必要なスポットの情報を返す
     * - vuex-module-decoratorsにおいて引数付きgetterはこの書き方になる
     * @param  mapId 必要なスポットが存在するマップのID
     * @return Mapコンポーネントが必要なスポットの情報
     */
    get getSpotsForMap() {
        return (mapId: number): SpotForMap[] => {
            const mapIndex: number = this.maps.findIndex((m: Map) => m.id === mapId);
            const spots: Spot[] = this.maps[mapIndex].spots;
            const spotsForMap: SpotForMap[] = [];
            spots.forEach((spot) => {
                spotsForMap.push({
                    id: spot.id,
                    name: spot.name,
                    coordinate: spot.coordinate,
                    shape: spot.shape,
                });
            });
            return spotsForMap;
        };
    }

    /**
     * SpotInfoコンポーネントが表示する情報を返す
     * @return SpotInfoコンポーネントに必要な情報
     */
    get infoOfFocusedSpot(): SpotInfo {
        const parentMapId: number = this.focusedSpot.mapId;
        const spotId: number = this.focusedSpot.spotId;
        const spot: Spot = getSpotById(this.maps, {parentMapId, spotId});
        const spotInfo: SpotInfo = {
            name:  spot.name,
        };
        return spotInfo;
    }

    /**
     * マップ配列から,マップIdとスポットIdで指定されたスポットを取得する．
     * 関数内で外部に定義したgetSpotByIdの本体を呼び出す．
     * @param targetSpot マップIdとスポットIdのオブジェクト
     * @throw MapNotFoundError 指定されたマップが見つからない場合に発生
     * @throw SpotNotFoundError 指定されたスポットが見つからない場合に発生
     */
    get getSpotById() {
        return (
            targetSpot: {
                parentMapId: number,
                spotId: number,
            },
        ): Spot => {
            return getSpotById(this.maps, targetSpot);
        };
    }

    /**
     * 指定されたスポットが詳細マップを持つかどうかを判定する．
     * @param targetSpot マップのIdとスポットのId
     * @return スポットが詳細マップを持つならばtrue, 持たないならばfalse
     */
    get spotHasDetailMaps() {
        return (
            targetSpot: {
                parentMapId: number,
                spotId: number,
            },
        ): boolean => {
            const spot = getSpotById(this.maps, targetSpot);
            if (spot.detailMapIds.length > 0) {
                return true;
            } else {
                return false;
            }
        };
    }

    /**
     * スポットのもつ詳細マップのうち、最後に参照された詳細マップのIdを返す
     * @param parentSpot どのマップのどのスポットかを示す情報.
     * @return lastViewdDetailMapId スポットが持つ詳細マップのうち、最後に参照された詳細マップのId．
     * まだ参照されていない場合はnullを返す．
     * @throw NoDetailMapsError スポットが詳細マップを持っていない場合に発生.
     */
    get getLastViewedDetailMapId() {
        return (parentSpot: {parentMapId: number, spotId: number}): number | null => {
            if (this.spotHasDetailMaps(parentSpot) === false) {
                throw new NoDetailMapsError('This spot has no detail maps...');
            }
            const spot = getSpotById(this.maps, parentSpot);
            const lastViewedDetailMapId: number | null = spot.lastViewedDetailMapId;
            return lastViewedDetailMapId;
        };
    }

    /**
     * ズームレベルによって変化する表示レベルを返す
     * @return 表示レベル('default' or 'detail')
     */
    get getDisplayLevel() {
        return (): DisplayLevelType => {
            return this.displayLevel;
        };
    }

    /**
     * - 画面上で表示されている
     * - 半径〇〇内で最も画面中央に近い
     * - 詳細マップを持っている
     * スポットのIDを返す
     * 条件に当てはまるスポットがない状態である場合nullを返す
     * @return スポットIDかnull
     */
    get getIdOfCenterSpotInRootMap() {
        return (): number | null => {
            return this.idOfCenterSpotInRootMap;
        };
    }

     /* 経由するノードidの配列を入力することで経路となるノードの配列を取得
     * @param nodeIds: 経路となるノードidの配列
     * @return nodesForNavigation: 経路となるノードの配列
     */
    get getNodesForNavigation() {
        return (nodeIds: number[]): Coordinate[][] => {
            // getterの中身は経路探索に依存しているため、現状テスト用のものを使用
            // ノードidの配列を入力として必要なノードを検索、配列として返すメソッドが必要
            const testRoutes: Node[][] = [[
                {
                    id: 0,
                    mapId: 0,
                    spotId: 0,
                    coordinate: {
                        lat: 33.595502,
                        lng: 130.218238,
                    },
                },
                {
                    id: 1,
                    mapId: 0,
                    spotId: 1,
                    coordinate: {
                    lat: 33.596502,
                    lng: 130.218238,
                    },
                },
                {
                    id: 2,
                    mapId: 0,
                    spotId: 2,
                    coordinate: {
                    lat: 33.596502,
                    lng: 130.219238,
                    },
                },
            ],
            [
                {
                    id: 0,
                    mapId: 0,
                    spotId: 0,
                    coordinate: {
                        lat: 33.595502,
                        lng: 130.218238,
                    },
                },
                {
                    id: 2,
                    mapId: 0,
                    spotId: 2,
                    coordinate: {
                    lat: 33.596502,
                    lng: 130.219238,
                    },
                },
                {
                    id: 1,
                    mapId: 0,
                    spotId: 1,
                    coordinate: {
                    lat: 33.596502,
                    lng: 130.218238,
                    },
                },
            ]];
            const nodesForNavigation: Coordinate[][] = [];
            testRoutes.forEach((route: Node[]) => {
                const wayPoints: Coordinate[] = route.map((wayPoint: Node) => wayPoint.coordinate);
                nodesForNavigation.push(wayPoints);
            });
            return nodesForNavigation;
        };
    }

    /**
     *
     * @param newFocusedSpot
     */
    @Mutation
    public setSpotInfoIsVisible(newVisibleState: boolean): void {
        this.spotInfoIsVisible = newVisibleState;
    }

    /**
     * Mapコンポーネント上でフォーカスされているスポットのIDを更新する
     * @param newFocusedSpot 新しくフォーカスされるスポット
     * 中にmapId, spotIdを持つ
     */
    @Mutation
    public setFocusedSpot(newFocusedSpot: {mapId: number, spotId: number}): void {
        this.focusedSpot = newFocusedSpot;
    }

    /**
     * 詳細マップ持ちスポットが最後に表示していた詳細マップのIdをセットする.
     * @param detailMapId 最後に参照された詳細マップのId
     * @param parentSpot どのマップのどのスポットかを示す情報
     * @throw NoDetailMapIdInSpotError スポットに存在しない詳細マップをセットしようとすると例外が発生
     */
    @Mutation
    public setLastViewedDetailMapId(
        payload: {
            detailMapId: number,
            parentSpot: { parentMapId: number, spotId: number };
        }): void {
        const detailMapId = payload.detailMapId;
        const parentMapId = payload.parentSpot.parentMapId;
        const spotId = payload.parentSpot.spotId;
        const spot = getSpotById(this.maps, payload.parentSpot);
        // detailMapIdがそのスポットに存在しない場合，例外を投げる
        if (!spot.detailMapIds.includes(detailMapId)) {
            throw new NoDetailMapIdInSpotError('Detail Map does not exist...');
        }
        const mapIndex: number = this.maps.findIndex((m: Map) => m.id === parentMapId);
        const spotIndex: number = this.maps[mapIndex].spots.findIndex((s: Spot) => s.id === spotId);
        this.maps[mapIndex].spots[spotIndex].lastViewedDetailMapId = detailMapId;
    }

    /**
     * ズームレベルで変化する表示レベルをsetする
     * @param newDisplayLevel setする表示レベル('default' or 'detail')
     */
    @Mutation
    public setDisplayLevel(newDisplayLevel: DisplayLevelType): void {
        this.displayLevel = newDisplayLevel;
    }

    /**
     * - 画面上で表示されている
     * - 半径〇〇内で最も画面中央に近い
     * - 詳細マップを持っている
     * スポットのIDを更新する
     * @param idOfCenterSpotInRootMap 上記のスポットのID
     */
    @Mutation
    public setIdOfCenterSpotInRootMap(idOfCenterSpotInRootMap: number): void {
        this.idOfCenterSpotInRootMap = idOfCenterSpotInRootMap;
    }

    /**
     * - 画面上で表示されている
     * - 半径〇〇内で最も画面中央に近い
     * - 詳細マップを持っている
     * スポットが存在していない状態にする
     */
    @Mutation
    public setNonExistentOfCenterSpotInRootMap(): void {
        this.idOfCenterSpotInRootMap = null;
    }

    /**
     * MapViewStateの情報を一括でset
     * - 現状は単体テストの入力用の仮メソッド
     * @param mapState マップの状態
     */
    @Mutation
    public setMapViewState(newMapViewState: MapViewState): void {
        this.maps              = newMapViewState.maps;
        this.rootMapId         = newMapViewState.rootMapId;
        this.spotInfoIsVisible  = newMapViewState.spotInfoIsVisible;
        this.focusedSpot.mapId  = newMapViewState.focusedSpot.mapId;
        this.focusedSpot.spotId = newMapViewState.focusedSpot.spotId;
        this.idOfCenterSpotInRootMap = newMapViewState.idOfCenterSpotInRootMap;
        this.displayLevel       = newMapViewState.displayLevel;
    }
}

export const mapViewStore = getModule(MapViewModule);
