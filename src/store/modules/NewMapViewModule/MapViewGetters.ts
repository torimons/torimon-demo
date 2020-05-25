import { Getters } from 'vuex-smart-module';
import { MapViewState } from './MapViewState';
import { RawMap, RawSpot, SpotInfo, SpotForMap, Bounds, DisplayLevelType, Coordinate, Node } from '@/store/types';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import { NoDetailMapsError } from '@/store/errors/NoDetailMapsError';
import { MapNotFoundError } from '@/store/errors/MapNotFoundError';
import { SpotNotFoundError } from '@/store/errors/SpotNotFoundError';

export class MapViewGetters extends Getters<MapViewState> {
    /**
     * ルートマップを返す
     * @return ルートマップのインスタンス
     */
    get rootMap(): Map {
        return this.state.rootMap;
    }

    /**
     * Mapコンポーネントで選択されているSpotのインスタンスを返す
     * @return スポットのインスタンス
     */
    get focusedSpot(): Spot | undefined {
        return this.state.focusedSpot;
    }

    /**
     * SpotInfoコンポーネントの表示非表示状態を返す
     * @return 表示状態の場合true
     */
    get spotInfoIsVisible(): boolean {
        return this.state.spotInfoIsVisible;
    }

    /**
     * ズームレベルによって変化する表示レベルを返す
     * @return 表示レベル('default' or 'detail')
     */
    get displayLevel(): DisplayLevelType {
        return this.state.displayLevel;
    }

    /**
     * - 画面上で表示されている
     * - 半径〇〇内で最も画面中央に近い
     * - 詳細マップを持っている
     * スポットのインスタンスを返す
     * 条件に当てはまるスポットがない状態である場合nullを返す
     * @return スポットのインスタンスかnull
     */
    get centerSpotInRootMap(): Spot | null {
        return this.state.centerSpotInRootMap;
    }

    /**
     * マップの中央に表示したいスポットを取得
     * @return スポットのインスタンス
     */
    get spotToDisplayInMapCenter(): Spot | null {
        return this.state.spotToDisplayInMapCenter;
    }
}
