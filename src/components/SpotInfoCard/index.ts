import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { store, mapViewGetters } from '@/store';
import { MapViewGetters } from '@/store/modules/MapViewModule/MapViewGetters';
import { SpotInfo } from '@/store/types';

@Component
/**
 * マップ上でスポットを選択した際に表示されるコンポーネント．
 * vuex上のstateを見て，表示内容，および表示/非表示を自動的に切り替える．
 */
export default class SpotInfoCard extends Vue implements SpotInfo {

    // SpotInfoインターフェースのメンバ
    public name: string = '';
    public description: string = '';
    public attachment: [{name: string, url: string}] = [{name: '', url: ''}];

    private isVisible: boolean = false;

    public mounted() {
        // focusedSpotの切り替えを検知して表示する内容を更新
        store.watch(
            (state, getters: MapViewGetters) => getters.focusedSpot,
            (value, oldValue) => this.updateSpotInfoContent(value),
        );
        // spotInfoIsVisibleの切り替えを検知して表示/非表示状態を更新
        store.watch(
            (state, getters: MapViewGetters) => getters.spotInfoIsVisible,
            (value, oldValue) => this.updateSpotInfoIsVisible(value),
        );
    }

    /**
     * 選択されているスポットIDの変更を検知すると，spotName, othersを更新して表示内容を更新する．
     * @param newFocusedSpot 変更後のマップIdとスポットId
     */
    private updateSpotInfoContent(
        newFocusedSpot: {mapId: number, spotId: number},
    ): void {
        const spotInfo: SpotInfo = mapViewGetters.getSpotInfo(newFocusedSpot);
        this.name = spotInfo.name;
        this.description = spotInfo.description;
    }

    /**
     * コンポーネントの表示/非表示を，visibleを更新する．
     * @param newVisibleState コンポーネントの可視化状態
     */
    private updateSpotInfoIsVisible(newVisibleState: boolean): void {
        this.isVisible = newVisibleState;
    }

}
