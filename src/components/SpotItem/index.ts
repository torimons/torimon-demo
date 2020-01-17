import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapViewGetters, mapViewMutations } from '@/store';

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

    private updateFocusedSpot(): void {
        mapViewMutations.setFocusedSpot({mapId: this.mapId, spotId: this.spotId});
    }
}
