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
        // 現在地を取得する
        this.currentPositionHandler = GeolocationWrapper.watchPosition(
            (pos: Position) => {
                this.currentPosition = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };
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

    /**
     * 現在地を取得できている場合、現在地とスポットの距離を計算し、文字列型にformatして返す
     * 現在地を取得できていない場合、空文字列を返す
     * @param spot 現在地との距離を計算したいスポット
     * @return 空文字列 
     * @return 文字列型の単位付きの距離
     */
    private calculateDistanceFromCurrentPosition(spot: Spot): string {
        if (this.currentPosition === undefined) {
            return '';
        }
        const distance = getDistance(spot.coordinate, this.currentPosition);
        return this.formatDistance(distance);
    }

    /**
     * 数値の距離を値によって、mまたはkm付きの文字列に変換する
     * @param distanceInMeters 変換したい距離(m)
     * @return 文字列型の単位付きの距離
     */
    private formatDistance(distanceInMeters: number): string {
        if (distanceInMeters < 1000) {
            return distanceInMeters.toString() + 'm';
        } else {
            const distanceInKMeters = Math.round(distanceInMeters / 100) / 10;
            return distanceInKMeters.toString() + 'km';
        }
    }
}
