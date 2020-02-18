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
     * @errors 親スポットがすでに登録されている場合エラーを送出する
     */
    public registerParentSpot(parentSpot: Spot) {
        if (this.parentSpot === undefined) {
            this.parentSpot = parentSpot;
        } else {
            throw new Error('ParentSpot is already registered');
        }
    }

    /**
     * スポットを追加する
     * @params 追加するスポット
     */
    public appendSpots(spots: Spot[]) {
        spots.map((spot) => this.spots.push(spot));
    }
}
