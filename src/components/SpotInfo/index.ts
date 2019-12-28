import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapViewStore } from '@/store/modules/MapViewModule';
import { Spot, Others } from '@/store/types';

@Component
/**
 * マップ上でスポットを選択した際に表示されるコンポーネント．
 * vuex上のstateを見て，表示内容，および表示/非表示を自動的に切り替える．
 */
export default class SpotInfo extends Vue {

    private isVisible: boolean = false;
    private spotName: string = '';
    private description: string = '';

    /**
     * updateSpotInfoContentで監視するプロパティ
     * @return 選択されているスポット
     */
    get focusedSpot(): {mapId: number, spotId: number} {
        return mapViewStore.focusedSpot;
    }

    /**
     * 選択されているスポットIDの変更を検知すると，spotName, othersを更新して表示内容を更新する．
     */
    @Watch('focusedSpot')
    private updateSpotInfoContent(
        newFocusedSpot: {mapId: number, spotId: number},
        oldFocusedSpot: {mapId: number, spotId: number},
    ): void {
        const spot: Spot = mapViewStore.getSpotById({
            parentMapId: newFocusedSpot.mapId,
            spotId: newFocusedSpot.spotId,
        });
        this.spotName = spot.name;
        const others: Others | undefined = spot.others;
        if (others === undefined) {
            this.description = '';
            return;
        }
        if (others.description !== undefined) {
            this.description = others.description;
        } else {
            this.description = '';
        }
    }

    /**
     * updateSpotInfoIsVisibleで監視するプロパティ
     * @return SpotInfoの可視化状態
     */
    get spotInfoIsVisible(): boolean {
        return mapViewStore.spotInfoIsVisible;
    }

    /**
     * コンポーネントの表示/非表示を，visibleを更新して切り替える.．
     */
    @Watch('spotInfoIsVisible')
    private updateSpotInfoIsVisible(newVisibleState: boolean, oldVisibileState: boolean): void {
        this.isVisible = newVisibleState;
    }

}
