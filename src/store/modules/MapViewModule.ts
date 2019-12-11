import { Mutation, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '@/store';
import { MapViewState, Map, Spot, SpotInfo, SpotForMap, Bounds, DisplayLevelType, Coordinate, Node } from '@/store/types';
import { sampleMaps } from '@/store/modules/sampleMaps';

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

    /**
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
    public idOfCenterSpotWithDetailMap: number | null = null;

    /**
     * スポットの詳細マップのどの階層が表示されるかを保持
     * #84にて作られるため仮作成
     */
    public focusedDetailMapId: number | null = 0;

    /**
     * ズームレベルに応じて切り替わる表示レベルを保持
     */
    public displayLevel: DisplayLevelType = 'default';

    /**
     * Mapコンポーネントが扱うマップの範囲を返す
     * @return マップの範囲
     */
    get rootMapBounds(): Bounds {
        return this.maps[this.rootMapId].bounds;
    }

    /**
     * Mapコンポーネントがアイコン表示のために必要なスポットの情報を返す
     * - vuex-module-decoratorsにおいて引数付きgetterはこの書き方になる
     * @param  mapId 必要なスポットが存在するマップのID
     * @return Mapコンポーネントが必要なスポットの情報
     */
    get getSpotsForMap() {
        return (mapId: number): SpotForMap[] => {
            const spots: Spot[] = this.maps[mapId].spots;
            const spotsForMap: SpotForMap[] = [];
            spots.forEach((spot) => {
                spotsForMap.push({
                    id: spot.id,
                    name: spot.name,
                    coordinate: spot.coordinate,
                    shape:    spot.shape,
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
        const spot: Spot = this.maps[this.focusedSpot.mapId].spots[this.focusedSpot.spotId];
        const spotInfo: SpotInfo = {
            name:  spot.name,
        };
        return spotInfo;
    }

    /**
     * 指定されたスポットが詳細マップを持つかどうかを判定する．
     * 存在しないMapIdやSpotIdを指定すると例外を投げる．
     * @param parentSpot マップのIdとスポットのId
     * @return スポットが詳細マップを持つならばtrue, 持たないならばfalse
     * @throw Error Mapが存在しない場合に発生
     * @throw Error Spotが存在しない場合に発生
     */
    get spotHasDetailMaps() {
        return (
            targetSpot: {
                parentMapId: number,
                spotId: number,
            },
        ): boolean => {
            const map: Map | undefined = this.maps.find((m: Map) => m.id === targetSpot.parentMapId);
            if (map === undefined) {
                // errors.tsがマージされたらmapNotFoundErrorに置き換える
                throw new Error('Map Not Found...');
            }

            const spot: Spot | undefined = map.spots.find((s: Spot) => s.id === targetSpot.spotId);
            if (spot === undefined) {
                // errors.tsがマージされたらspotNotFoundErrorに置き換える
                throw new Error('Spot Not Found...');
            }

            if (spot.detailMapIds.length > 0) {
                return true;
            } else {
                return false;
            }
        };
    }

    /**
     * スポットの詳細マップのどの階層が表示されているかをMapIdで返す
     * 無ければ例外を返す
     * @return mapId
     */
    get getFocusedDetailMapId(): number {
        if (this.focusedDetailMapId != null) {
            return this.focusedDetailMapId;
        } else {
            throw new Error('詳細マップがありません');
        }
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
    get getIdOfCenterSpotWithDetailMap() {
        return (): number | null => {
            return this.idOfCenterSpotWithDetailMap;
        };
    }

     /* 経由するノードidの配列を入力することで経路となるノードの配列を取得
     * @param nodeIds: 経路となるノードidの配列
     * @return nodesForNavigation: 経路となるノードの配列
     */
    get getNodesForNavigation() {
        return (nodeIds: number[]): Coordinate[] => {
            // getterの中身は経路探索に依存しているため、現状テスト用のものを使用
            // ノードidの配列を入力として必要なノードを検索、配列として返すメソッドが必要
            const nodes: Node[] = [
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
            ];
            const nodesForNavigation: Coordinate[] = [];
            nodes.forEach((node: Node) => nodesForNavigation.push(node.coordinate));
            return nodesForNavigation;
        };
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
     * @param idOfCenterSpotWithDetailMap 上記のスポットのID
     */
    @Mutation
    public setIdOfCenterSpotWithDetailMap(idOfCenterSpotWithDetailMap: number): void {
        this.idOfCenterSpotWithDetailMap = idOfCenterSpotWithDetailMap;
    }

    /**
     * - 画面上で表示されている
     * - 半径〇〇内で最も画面中央に近い
     * - 詳細マップを持っている
     * スポットが存在していない状態にする
     */
    @Mutation
    public setNonExistentOfCenterSpotWithDetailMap(): void {
        this.idOfCenterSpotWithDetailMap = null;
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
        this.idOfCenterSpotWithDetailMap = newMapViewState.idOfCenterSpotWithDetailMap;
        this.focusedDetailMapId = newMapViewState.focusedDetailMapId;
        this.displayLevel       = newMapViewState.displayLevel;
    }

    /**
     * 詳細マップ持ちスポットのうち表示されている階層のmapIDをset
     * @param detailMapId 表示されている階層のmapID
     */
    @Mutation
    public setFocusedDetailMapId(detailMapId: number | null): void {
        this.focusedDetailMapId = detailMapId;
    }
}

export const mapViewStore = getModule(MapViewModule);
