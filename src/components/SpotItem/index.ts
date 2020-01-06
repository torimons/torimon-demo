import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapViewMutations } from '@/store';

@Component
export default class SpotItem extends Vue {
    // 親からスポット名と距離を受けとり表示する
    @Prop()
    private spotName!: string;
    @Prop()
    private distance!: number;
    @Prop()
    private spotIds!: {mapId: number, spotId: number};

    // 選択されているスポットのmapIdとspotId
    private selectedSpot: null | {mapId: number, spotId: number} = null;

    @Watch('selectedSpot')
    private updateFocusedSpot(): void{
        if (this.selectedSpot !== null){
            mapViewMutations.setFocusedSpot(this.selectedSpot)
        }
    }
}
