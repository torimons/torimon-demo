import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapViewGetters, mapViewMutations } from '@/store';
import SpotItem from '@/components/SpotItem/index.vue';
import { Spot, Coordinate } from '@/store/types';
import { GeolocationWrapper } from '@/components/Map/GeolocationWrapper';
import { LatLngExpression } from 'leaflet';
import { getDistance } from 'geolib';

@Component({
    components: {
        SpotItem,
    },
})
export default class SpotList extends Vue {
    @Prop() public spotSearchResults!: Spot[];

    private currentPositionHandler?: number;
    private currentPosition?: Coordinate;

    public mounted() {
        this.currentPositionHandler = GeolocationWrapper.watchPosition(
            (pos: Position) => {
                this.currentPosition = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };
                console.log(this.currentPosition);
            },
            (err: PositionError) => {
                throw err;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    }

    private calculateDistanceFromCurrentPosition(spot: Spot): string {
        if (this.currentPosition === undefined) {
            return '';
        }
        const distance = getDistance(spot.coordinate, this.currentPosition);
        // return this.formatDistance(distance);
        return distance.toString();
    }

    private formatDistance(distanceInMeter: number): string {
        // m km表記で返す
        return '';
    }
}
