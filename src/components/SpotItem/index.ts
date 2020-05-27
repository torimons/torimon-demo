import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapViewMutations } from '@/store/newMapViewIndex';
import Spot from '@/Spot/Spot.ts';
import Map from '@/Map/Map.ts';

@Component
export default class SpotItem extends Vue {
    // 親からスポット名と距離を受けとり表示する
    @Prop()
    private spot!: Spot;
    @Prop()
    private distance!: number;
    private parentSpotName!: string;

    public mounted() {
        const parentSpot = this.spot.getParentMap().getParentSpot();
        if (parentSpot === undefined) {
            this.parentSpotName = '';
        } else {
            this.parentSpotName = parentSpot.getName();
        }
    }

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

    /*
     * SpotList内のSpotItemを選択した際にfocusedSpotを更新する関数
     */
    private updateFocusedSpot(): void {
        mapViewMutations.setFocusedSpot(this.spot);
    }
    private moveMapViewToThisSpot(): void {
        mapViewMutations.setSpotToDisplayInMapCenter(this.spot);
    }
}
