import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapViewStore } from '@/store/modules/MapViewModule';
import { Spot } from '@/store/types';

@Component
/**
 * マップ上でスポットを選択した際に表示されるコンポーネント．
 * vuex上のstateを見て，表示内容，および表示/非表示を自動的に切り替える．
 */
export default class SpotInfo extends Vue {

    private spotName: string = '';
    // othersはまだ形式が決まっていないためanyとしています．
    private others: any = {};
    private isVisible: boolean = false;

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
            // spotの型はまだ未定義のためanyとしています．
            // const spot: any = this.$store.getters.getInfoOfCurrentSpot;
            const spot: Spot = mapViewStore.getSpotById({
                parentMapId: newFocusedSpot.mapId,
                spotId: newFocusedSpot.spotId,
            });
            this.spotName = spot.name;
            if (spot.others != undefined) {
                this.others = spot.others;
            } else {
                this.others = '';
            }
    }

    /**
     * updateSpotInfoIsVisibleで監視するプロパティ
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
