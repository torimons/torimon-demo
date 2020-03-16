import { Coordinate, Shape } from '@/store/types.ts';
import Map from '@/Map/Map.ts';

export default class Spot {
    private parentMap: Map | undefined = undefined;
    private detailMaps: Map[] = [];

    constructor(private id: number,
                private name: string,
                private coordinate: Coordinate,
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

    /** 親マップをセットする
     * @params セットする親マップ
     */
    public setParentMap(parentMap: Map) {
        this.parentMap = parentMap;
    }

    /**
     * 詳細マップを追加する
     * @params 追加する詳細マップの配列
     */
    public addDetailMaps(detailMaps: Map[]) {
        this.detailMaps = this.detailMaps.concat(detailMaps);
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

    /**
     * 指定したidをもつ子孫マップを探す
     * @params id 指定するid
     * @returns 該当するマップ，またはnull
     */
    public findDescendantMap(id: number): Map | null {
        for (const map of this.detailMaps) {
            // 自身の子マップを探す
            if (map.getId() === id) {
                return map;
            }
            // 子孫が該当するかチェック
            const foundMap: Map | null = map.findDescendantMap(id);
            if (foundMap === null) {
                continue;
            }
            return foundMap;
        }
        return null;
    }
}
