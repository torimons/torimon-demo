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
     * 自身のidを返す
     * @returns id 自身のid
     */
    public getId(): number {
        return this.id;
    }

    /** 親スポットをセットする
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

    /**
     * 指定したidをもつ子孫スポットを探す
     * @params id 指定するid
     * @returns 該当するスポット，またはnull
     */
    public searchSpot(id: number): Spot | null {
        for (const spot of this.spots) {
            // 自身の子が該当するかチェック
            if (spot.getId() === id) {
                return spot;
            }
            // 子孫が該当するかチェック
            const foundSpot: Spot | null = spot.searchSpot(id);
            if (foundSpot === null) {
                continue;
            }
            return foundSpot;
        }
        return null;
    }

    /**
     * 指定したidをもつ子孫マップを探す
     * @params id 指定するid
     * @returns 該当するマップ，またはnull
     */
    public searchMap(id: number): Map | null {
        // 自分自身が該当するかチェック
        if (this.id === id) {
            return this;
        }
        // 自身の子スポットの子孫を探す
        for (const spot of this.spots) {
            const foundMap = spot.searchMap(id);
            if (foundMap === null) {
                continue;
            }
            return foundMap;
        }
        return null;
    }
}
