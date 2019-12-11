import { Mutation, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '@/store';
import { MapViewState, Map, Spot, SpotInfo, SpotForMap, Bounds } from '@/store/types';
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
        throw new MapNotFoundError('Map dose not found...');
    }
    const spot: Spot | undefined = map.spots.find((s: Spot) => s.id === targetSpot.spotId);
    if (spot === undefined) {
        throw new SpotNotFoundError('Spot dose not found...');
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
        const spot: Spot = this.maps[this.focusedSpot.mapId].spots[this.focusedSpot.spotId];
        const spotInfo: SpotInfo = {
            name:  spot.name,
        };
        return spotInfo;
    }

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
     * mutationは複数の引数を受け取れないため，実際に渡すときはpayloadオブジェクトとしてまとめて渡す必要がある．
     * @param detailMapId 最後に参照された詳細マップのId
     * @param parentSpot どのマップのどのスポットかを示す情報
     * @throw スポットに存在しない詳細マップをセットしようとすると例外を投げる
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
        this.spotInfoIsVisible  = newMapViewState.spotInfoIsVisible;
        this.idOfCenterSpotWithDetailMap = newMapViewState.idOfCenterSpotWithDetailMap;
    }
}

export const mapViewStore = getModule(MapViewModule);
