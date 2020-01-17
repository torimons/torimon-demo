import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapViewMutations } from '@/store';

@Component
export default class SpotItem extends Vue {
    // 親からスポット名と距離を受けとり表示する
    @Prop()
    private spotName!: string;
    @Prop()
    private parentSpotName!: string;
    @Prop()
    private floorName!: string;
    @Prop()
    private distance!: number;
    @Prop()
    private mapId!: number;
    @Prop()
    private spotId!: number;

    /**
     * SpotItemがクリックされると呼ばれ，SpotListを非表示にする．
     * ただし，直接非表示にするのでなく，SpotItem -> SpotList -> SpotSearchまで
     * Emitして，SpotSearchで最終的に非表示にする．
     */
    public hideSpotList() {
        this.$emit('hideSpotList');
    }

    /**
     * SpotItemがクリックされると呼ばれ，SpotInfoを表示する．
     */
    public showSpotInfo() {
        mapViewMutations.setSpotInfoIsVisible(true);
    }
}
