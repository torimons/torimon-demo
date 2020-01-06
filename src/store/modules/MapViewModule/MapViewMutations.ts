import { Mutations } from 'vuex-smart-module';
import { MapViewState } from './MapViewState';
import { Map, Spot, DisplayLevelType } from '@/store/types';
import { NoDetailMapIdInSpotError } from '@/store/errors/NoDetailMapIdInSpotError';
import { mapViewGetters } from '@/store';

export class MapViewMutations extends Mutations<MapViewState> {
    /**
     * Mapコンポーネント上でフォーカスされているスポットのIDを更新する
     * @param newFocusedSpot 新しくフォーカスされるスポット
     * 中にmapId, spotIdを持つ
     */
    public setFocusedSpot(newFocusedSpot: {mapId: number, spotId: number}): void {
        this.state.focusedSpot = newFocusedSpot;
    }

    /**
     * spotInfoコンポーネントの可視化状態を更新する．
     * @param newVisibleState spotInfoコンポーネントの可視化状態
     */
    public setSpotInfoIsVisible(newVisibleState: boolean): void {
        this.state.spotInfoIsVisible = newVisibleState;
    }

    /**
     * 詳細マップ持ちスポットが最後に表示していた詳細マップのIdをセットする.
     * @param detailMapId 最後に参照された詳細マップのId
     * @param parentSpot どのマップのどのスポットかを示す情報
     * @throw NoDetailMapIdInSpotError スポットに存在しない詳細マップをセットしようとすると例外が発生
     */
    public setLastViewedDetailMapId(
        payload: {
            detailMapId: number,
            parentSpot: { parentMapId: number, spotId: number };
        }): void {
        const detailMapId = payload.detailMapId;
        const parentMapId = payload.parentSpot.parentMapId;
        const spotId = payload.parentSpot.spotId;
        const spot = mapViewGetters.getSpotById({ parentMapId, spotId });
        // detailMapIdがそのスポットに存在しない場合，例外を投げる
        if (!spot.detailMapIds.includes(detailMapId)) {
            throw new NoDetailMapIdInSpotError('Detail Map does not exist...');
        }
        const mapIndex: number = this.state.maps.findIndex((m: Map) => m.id === parentMapId);
        const spotIndex: number = this.state.maps[mapIndex].spots.findIndex((s: Spot) => s.id === spotId);
        this.state.maps[mapIndex].spots[spotIndex].lastViewedDetailMapId = detailMapId;
    }

    /**
     * ズームレベルで変化する表示レベルをsetする
     * @param newDisplayLevel setする表示レベル('default' or 'detail')
     */
    public setDisplayLevel(newDisplayLevel: DisplayLevelType): void {
        this.state.displayLevel = newDisplayLevel;
    }

    /**
     * - 画面上で表示されている
     * - 半径〇〇内で最も画面中央に近い
     * - 詳細マップを持っている
     * スポットのIDを更新する
     * @param idOfCenterSpotInRootMap 上記のスポットのID
     */
    public setIdOfCenterSpotInRootMap(idOfCenterSpotInRootMap: number): void {
        this.state.idOfCenterSpotInRootMap = idOfCenterSpotInRootMap;
    }

    /**
     * - 画面上で表示されている
     * - 半径〇〇内で最も画面中央に近い
     * - 詳細マップを持っている
     * スポットが存在していない状態にする
     */
    public setNonExistentOfCenterSpotInRootMap(): void {
        this.state.idOfCenterSpotInRootMap = null;
    }

    /**
     * MapViewStateの情報を一括でset
     * - 現状は単体テストの入力用の仮メソッド
     * @param mapState マップの状態
     */
    public setMapViewState(newMapViewState: MapViewState): void {
        this.state.maps              = newMapViewState.maps;
        this.state.rootMapId         = newMapViewState.rootMapId;
        this.state.spotInfoIsVisible  = newMapViewState.spotInfoIsVisible;
        this.state.focusedSpot.mapId  = newMapViewState.focusedSpot.mapId;
        this.state.focusedSpot.spotId = newMapViewState.focusedSpot.spotId;
        this.state.idOfCenterSpotInRootMap = newMapViewState.idOfCenterSpotInRootMap;
        this.state.displayLevel       = newMapViewState.displayLevel;
    }
}
