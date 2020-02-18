import Spot from '@/Spot/Spot.ts';
import { Bounds } from '@/store/types';

export default class Map {
    private parentSpot: Spot | undefined = undefined;
    private spots: Spot[] = [];

    constructor(private id: number,
                private name: string,
                private bounds: Bounds,
                private floorName?: string) {
    }

    /**
     * 親スポットを登録する
     * @params 登録する親スポット
     */
    public registerParentSpot(parentSpot: Spot) {
        this.parentSpot = parentSpot;
    }

    /**
     * スポットを追加する
     * @params 追加するスポット
     */
    public appendSpots(spots: Spot[]) {
        spots.map((spot) => this.spots.push(spot));
    }
}
