import { Mutation, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '@/store';
import { MapViewState, Map, Spot, SpotInfo, SpotForMap, Bounds } from '@/store/types';
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
     * スポットのもつ詳細マップのうち、最後に参照された詳細マップのIdを返す
     * @param parentSpot どのマップのどのスポットかを示す情報.
     * @return lastViewdDetailMapId スポットが持つ詳細マップのうち、最後に参照された詳細マップのId．
     * 存在しない場合はnullを返す．
     */
    get getLastViewedDetailMapId() {
        return (parentSpot: {parentMapId: number, spotId: number}): number | null => {
            const parentMap: Map = this.maps[parentSpot.parentMapId];
            const spot: Spot = parentMap.spots[parentSpot.spotId];
            const lastViewedDetailMapId: number | null = spot.lastViewedDetailMapId;
            return lastViewedDetailMapId;
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
     * @thorow スポットに存在しない詳細マップをセットしようとすると例外を投げる
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
        // detailMapIdがそのスポットに存在しない場合，例外を投げる
        if (!this.maps[parentMapId].spots[spotId].detailMapIds.includes(detailMapId)) {
            // エラー定義ファイルがマージされた時点でエラーは書き換えます．
            throw new Error('Detail Map does not exist...');
        }
        this.maps[parentMapId].spots[spotId].lastViewedDetailMapId = detailMapId;
    }

    /**
     * MapViewStateの情報を一括でset
     * - 現状は単体テストの入力用の仮メソッド
     * @param mapState マップの状態
     */
    @Mutation
    public setMapViewState(newMapViewState: MapViewState): void {
        this.maps               = newMapViewState.maps;
        this.rootMapId          = newMapViewState.rootMapId;
        this.focusedSpot.mapId  = newMapViewState.focusedSpot.mapId;
        this.focusedSpot.spotId = newMapViewState.focusedSpot.spotId;
        this.spotInfoIsVisible  = newMapViewState.spotInfoIsVisible;
    }
}

export const mapViewStore = getModule(MapViewModule);
