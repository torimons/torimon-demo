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
     * @return 現在選択されているスポットのspotID
     */
    private get selecedSpotID(): number {
        return this.$store.getters.getSelecedSpotID;
    }

    /**
     * 現在選択されているスポットのmapIDをvuexから取得する
     * @return 現在選択されているスポットのmapID
     */
    private get selecedMapID(): number {
        return this.$store.getters.getSelecedSpotID;
    }

    // spotList内にある検索結果（spotItem）が選択された際にfocusedSpotを更新する.
    @Watch('selecedSpotID')
    private updateFocusedSpotItem(): void {
        const newSpotID: number = this.$store.getters.getSelectedSpotID;
        const newMapID: number = this.$store.getters.getselectedMapID;
        const newSpot: { mapId: number, spotId: number} = { mapId: newMapID, spotId: newSpotID };
        mapViewMutations.setFocusedSpot(newSpot);
    }
}
