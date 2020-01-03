import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapViewGetters, mapViewMutations } from '@/store';

@Component
export default class SpotItem extends Vue {
    // 親からスポット名と距離を受けとり表示する
    @Prop()
    private spotName!: string;
    @Prop()
    private distance!: number;
    @Prop()
    private spotId!: number;

    /**
     * 現在選択されているスポットIDをvuexから取得する
     * @return 現在選択されているスポットのID
     */
    private get currentSpotID(): number {
        return this.$store.getters.getCurrentSpotID;
    }

    // spotList内にある検索結果（spotItem）が選択された際にfocusedSpotを更新する.
    @Watch('CurrentSpotID')
    private updateFocusedSpotItem(): void {
        mapViewStore.focusedSpot.spotId = this.$store.getters.getCurrentSpotID;
        mapViewStore.setFocusedSpot(mapViewStore.focusedSpot);
    }
}
