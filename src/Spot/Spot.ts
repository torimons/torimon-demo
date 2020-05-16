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
     * @return id 自身のid
     */
    public getId(): number {
        return this.id;
    }

    /** 親マップをセットする
     * @param セットする親マップ
     */
    public setParentMap(parentMap: Map) {
        this.parentMap = parentMap;
    }

    /**
     * 詳細マップを追加する
     * @param 追加する詳細マップの配列
     */
    public addDetailMaps(detailMaps: Map[]) {
        this.detailMaps = this.detailMaps.concat(detailMaps);
    }

    /**
     * 指定したidをもつ子孫スポットを探す
     * @param id 指定するid
     * @return 該当するスポット，またはnull
     */
    public findSpot(id: number): Spot | null {
        if (this.id === id) {
            return this;
        }
        for (const map of this.detailMaps) {
            const foundSpot: Spot | null = map.findSpot(id);
            if (foundSpot !== null) {
                return foundSpot;
            }
        }
        return null;
    }

    /**
     * 指定したidをもつ子孫マップを探す
     * @param id 指定するid
     * @return 該当するマップ，またはnull
     */
    public findMap(id: number): Map | null {
        for (const map of this.detailMaps) {
            const foundMap: Map | null = map.findMap(id);
            if (foundMap !== null) {
                return foundMap;
            }
        }
        return null;
    }
}
