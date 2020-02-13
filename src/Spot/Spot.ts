import { Coordinate, Shape } from '@/store/types.ts';
import Map from '@/Map/Map.ts';

export default class Spot {
    constructor(private id: number,
                private name: string,
                private coordinate: Coordinate,
                private parentMap: Map,
                private detailMaps: Map[],
                private shape?: Shape,
                private floorName?: string,
                private description?: string,
                private attachment?: [{name: string, url: string}]) {
    }

    /**
     * 自身のidを返す
     * @returns id 自身のid
     */
    public getId(): number {
        return this.id;
    }

    /**
     * 指定したidをもつ子孫スポットを探す
     * @params id 指定するid
     * @returns 該当するスポット，またはnull
     */
    public findDescendantSpot(id: number): Spot | null {
        // 自身の子マップの子孫を探す
        for (const map of this.detailMaps) {
            const foundSpot: Spot | null = map.findDescendantSpot(id);
            if (foundSpot === null) {
                continue;
            }
            return foundSpot;
        }
        return null;
    }
}
