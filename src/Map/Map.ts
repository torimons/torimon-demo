import Spot from '@/Spot/Spot.ts';
import { Bounds } from '@/store/types';

export default class Map {
    constructor(private id: number,
                private name: string,
                private spots: Spot[],
                private bounds: Bounds,
                private parentSpot?: Spot,
                private floorName?: string) {
    }

    /**
     * 指定したidをもつ子孫スポットを探す
     * @params id 指定するid
     * @returns 該当するスポット，またはnull
     */
    public findDescendantSpot(id: number): Spot | null {
        for (const spot of this.spots) {
            // 自身の子が該当するかチェック
            if (spot.getId() === id) {
                return spot;
            }
            // 子孫が該当するかチェック
            const foundSpot: Spot | null = spot.findDescendantSpot(id);
            if (foundSpot === null) {
                continue;
            }
            return foundSpot;
        }
        return null;
    }
}
