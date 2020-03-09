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
     * 親スポットをセットする
     * @params セットする親スポット
     */
    public setParentSpot(parentSpot: Spot) {
        this.parentSpot = parentSpot;
    }

    /**
     * スポットを追加する
     * @params 追加するスポット
     */
    public addSpots(spots: Spot[]) {
        this.spots = this.spots.concat(spots);
    }
}
