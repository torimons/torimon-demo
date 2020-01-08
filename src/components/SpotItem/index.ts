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

    // propsを直接触るとwarningが出るためデータ保管用のメンバを用意
    private computedSpot: {mapId: number, spotId: number} = this.spotIds;

    private updateFocusedSpot(selectedSpot: {mapId: number, spotId: number}): void {
        mapViewMutations.setFocusedSpot(selectedSpot);
    }
}
