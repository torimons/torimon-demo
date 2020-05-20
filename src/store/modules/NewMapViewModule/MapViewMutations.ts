import { Mutations } from 'vuex-smart-module';
import { MapViewState } from './MapViewState';
import { RawMap, RawSpot, DisplayLevelType } from '@/store/types';
import { NoDetailMapIdInSpotError } from '@/store/errors/NoDetailMapIdInSpotError';
import { mapViewGetters } from '@/store';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

export class MapViewMutations extends Mutations<MapViewState> {
    /**
     * Mapコンポーネント上でフォーカスされているスポットを更新する
     * @param newFocusedSpot 新しくフォーカスされるスポット
     */
    public setFocusedSpot(newFocusedSpot: Spot): void {
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
     * スポットを更新する
     * @param centerSpotInRootMap 上記のスポット
     */
    public setCenterSpotInRootMap(centerSpotInRootMap: Spot): void {
        this.state.centerSpotInRootMap = centerSpotInRootMap;
    }

    /**
     * - 画面上で表示されている
     * - 半径〇〇内で最も画面中央に近い
     * - 詳細マップを持っている
     * スポットが存在していない状態にする
     */
    public setNonExistentOfCenterSpotInRootMap(): void {
        this.state.centerSpotInRootMap = null;
    }

    /**
     * 画面中央に近いspotをセットする
     * @param spot セットしたいスポット
     */
    public setSpotToDisplayInMapCenter(spot: Spot): void {
        this.state.spotToDisplayInMapCenter = spot;
    }

    /**
     * MapViewStateの情報を一括でset
     * - 現状は単体テストの入力用の仮メソッド
     * @param mapState マップの状態
     */
    public setMapViewState(newMapViewState: MapViewState): void {
        this.state.rootMap             = newMapViewState.rootMap;
        this.state.spotInfoIsVisible   = newMapViewState.spotInfoIsVisible;
        this.state.focusedSpot         = newMapViewState.focusedSpot;
        this.state.centerSpotInRootMap = newMapViewState.centerSpotInRootMap;
        this.state.displayLevel        = newMapViewState.displayLevel;
    }
}