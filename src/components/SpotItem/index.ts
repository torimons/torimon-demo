import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapViewGetters, mapViewMutations } from '@/store';
import { LatLngExpression } from 'leaflet';

@Component
export default class SpotItem extends Vue {
    // 親からスポット名と距離を受けとり表示する
    @Prop()
    private spotName!: string;
    @Prop()
    private distance!: number;
    @Prop()
    private spotId!: number;

    private moveMapViewToThisSpot(): void {
        // mapViewMutations.setSpotToFocus({ mapId: this.mapId, spotId: this.spotId });
    }
}
