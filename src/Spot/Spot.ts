import { Coordinate, Shape } from '@/store/types.ts';
import Map from '@/Map/Map.ts';

export default class Spot {
    private parentMap: Map | undefined = undefined;
    private detailMaps: Map[] = [];
    private lastViewedDetailMap: Map | undefined = undefined;

    constructor(private id: number,
                private name: string,
                private coordinate: Coordinate,
                private shape?: Shape,
                private floorName?: string,
                private description?: string,
                private attachment?: [{name: string, url: string}]) {
    }

    /**
     * 親マップをセットする
     * @param parentMap セットする親マップ
     */
    public setParentMap(parentMap: Map) {
        this.parentMap = parentMap;
    }

    /**
     * 詳細マップを追加する
     * @param detailMaps 追加する詳細マップの配列
     */
    public addDetailMaps(detailMaps: Map[]) {
        this.detailMaps = this.detailMaps.concat(detailMaps);
        // lastViewedDetailMapの初期化
        if (this.lastViewedDetailMap === undefined && detailMaps.length > 0) {
            this.lastViewedDetailMap = detailMaps[0];
        }
    }

    /**
     * 最後に表示された詳細マップを返す
     * @return 最後に表示された詳細マップ
     */
    public getLastViewedDetailMap(): Map | undefined {
        return this.lastViewedDetailMap;
    }

    /**
     * 最後に表示された詳細マップを更新する
     * @param lastViewedDetailMap 最後に表示された詳細マップ
     */
    public setLastViewedDetailMap(lastViewedDetailMap: Map): void {
        this.lastViewedDetailMap = lastViewedDetailMap;
    }
}
