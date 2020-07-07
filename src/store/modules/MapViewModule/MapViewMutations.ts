import { Mutations } from 'vuex-smart-module';
import { MapViewState, initMap } from './MapViewState';
import { RawMap, RawSpot, DisplayLevelType } from '@/store/types';
import { NoDetailMapIdInSpotError } from '@/store/errors/NoDetailMapIdInSpotError';
import { mapViewGetters } from '@/store';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

export class MapViewMutations extends Mutations<MapViewState> {
    /**
     * 新たにrootMapをsetする
     * @param newRootMap
     */
    public setRootMap(newRootMap: Map) {
        this.state.rootMap = newRootMap;
    }

    /**
     * Mapコンポーネント上でフォーカスされているスポットを更新する
     * @param newFocusedSpot 新しくフォーカスされるスポット
     */
    public setFocusedSpot(newFocusedSpot: Spot): void {
        // 今まで{id:1}みたいなオブジェクトを毎回生成してsetしていたので変更をwatchできていたが，
        // Spotの全く同じインスタンスをsetしようとすると変更が検知できない．
        // 例:検索でSpotItemをクリック，マップのマーカー以外をクリックする，再び検索で同じSpotItemをクリックする
        // 応急処置としてundefinedをsetしている
        this.state.focusedSpot = undefined;
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
        // 今まで{id:1}みたいなオブジェクトを毎回生成してsetしていたので変更をwatchできていたが，
        // Spotの全く同じインスタンスをsetしようとすると変更が検知できない．
        // 例:検索でSpotItemをクリック，マップのマーカー以外をクリックする，再び検索で同じSpotItemをクリックする
        // 応急処置としてnullをsetしている
        this.state.spotToDisplayInMapCenter = null;
        this.state.spotToDisplayInMapCenter = spot;
    }

    /**
     * MapViewModuleにテストデータのマップをset
     * 現状は単体テストの入力用の仮メソッド
     * @param rawMaps テストに使用するRawMapの配列
     */
    public setRootMapForTest(rawMaps: RawMap[]): void {
        this.state.rootMap = initMap(rawMaps);
        this.state.spotInfoIsVisible = false;
        this.state.focusedSpot = undefined;
        this.state.centerSpotInRootMap = null;
        this.state.displayLevel = 'default';
    }

    /**
     * (デモ用)demoMapに新しいマップを追加する
     * @param map 追加するマップ
     */
    public addDemoMap(map: Map) {
        this.state.demoMaps = this.state.demoMaps.concat(map);
    }
    public setIsMapCreated(newIsMapCreated: boolean) {
        this.state.isMapCreated = newIsMapCreated;
    }
}
