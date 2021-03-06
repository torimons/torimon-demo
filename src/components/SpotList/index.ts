import { Component, Prop, Vue } from 'vue-property-decorator';
import SpotItem from '@/components/SpotItem/index.vue';
import { RawSpot, Coordinate } from '@/store/types';
import { GeolocationWrapper } from '@/components/MapView/GeolocationWrapper';
import { LatLngExpression } from 'leaflet';
import { getDistance } from 'geolib';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

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
     * SpotItemからemitを受け取ると，SpotSearchにSpotList(自身)を
     * 非表示にするようにemitする．
     */
    public hideSpotList() {
        this.$emit('hideSpotList', false);
    }

    /**
     * 現在地とスポットの距離を計算し、文字列型にformatして返す
     * 現在地を取得できていない場合、空文字列を返す
     * @param spot 現在地との距離を計算したいスポット
     * @return 空文字列
     * @return 文字列型の単位付きの距離
     */
    private calculateDistanceFromCurrentPosition(spot: Spot): string {
        if (this.currentPosition === undefined) {
            return '';
        }
        const distance = getDistance(spot.getCoordinate(), this.currentPosition);
        return this.formatDistance(distance);
    }

    /**
     * 値によって数値の距離をmまたはkm付きの文字列に変換する
     * @param distanceInMeters 変換したい距離(m)
     * @return 文字列型の単位付きの距離
     */
    private formatDistance(distanceInMeters: number): string {
        if (distanceInMeters < 1000) {
            return distanceInMeters.toString() + 'm';
        } else {
            // km表示に変換した時の小数点第一位以下を丸める
            const distanceInKMeters = Math.round(distanceInMeters / 100) / 10;
            return distanceInKMeters.toString() + 'km';
        }
    }
}
