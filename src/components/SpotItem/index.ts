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
    private spotIds!: {mapId: number, spotId: number};

    private updateFocusedSpot(selectedSpot: {mapId: number, spotId: number}): void {
        mapViewMutations.setFocusedSpot(selectedSpot);
    }
}
