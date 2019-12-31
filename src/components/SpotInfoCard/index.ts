import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { store, mapViewGetters, mapViewMutations } from '@/store';
import { Spot, SpotInfo } from '@/store/types';

@Component
/**
 * マップ上でスポットを選択した際に表示されるコンポーネント．
 * vuex上のstateを見て，表示内容，および表示/非表示を自動的に切り替える．
 */
export default class SpotInfoCard extends Vue {

    private isVisible: boolean = false;
    private spotName: string = '';
    private description: string = '';

    /**
     * updateSpotInfoContentで監視するプロパティ
     * @return 選択されているスポット
     */
    get focusedSpot(): {mapId: number, spotId: number} {
        return mapViewGetters.focusedSpot;
    }

    /**
     * 選択されているスポットIDの変更を検知すると，spotName, othersを更新して表示内容を更新する．
     */
    @Watch('focusedSpot')
    private updateSpotInfoContent(
        newFocusedSpot: {mapId: number, spotId: number},
        oldFocusedSpot: {mapId: number, spotId: number},
    ): void {
        const spotInfo: SpotInfo = mapViewGetters.getSpotInfo(newFocusedSpot);
        this.spotName = spotInfo.name;
        this.description = spotInfo.description;
    }

    /**s
     * updateSpotInfoIsVisibleで監視するプロパティ
     * @return SpotInfoの可視化状態
     */
    get spotInfoIsVisible(): boolean {
        return mapViewGetters.spotInfoIsVisible;
    }

    /**
     * コンポーネントの表示/非表示を，visibleを更新して切り替える.．
     */
    @Watch('spotInfoIsVisible')
    private updateSpotInfoIsVisible(newVisibleState: boolean, oldVisibileState: boolean): void {
        this.isVisible = newVisibleState;
    }

}
