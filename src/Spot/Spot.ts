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
     * 自身のidを返す
     * @return id 自身のid
     */
    public getId(): number {
        return this.id;
    }

    /**
     * 親mapをセットし,セットしたmapの子spotに自身を追加する.
     * @param parentMap セットする親map
     */
    public setParentMap(parentMap: Map): void {
        if (this.hasParentMap(parentMap)) {
            return;
        }
        this.parentMap = parentMap;
        this.floorName = parentMap.getFloorName();
        parentMap.addSpots([this]);
    }

    /**
     * 詳細mapを追加し,追加した詳細mapにparentSpotとして自身をセットする.
     * すでに追加済みであれば追加しない.
     * @param detailMaps 追加する詳細マップの配列
     */
    public addDetailMaps(detailMaps: Map[]): void {
        for (const detailMap of detailMaps) {
            if (this.hasDetailMap(detailMap)) {
                continue;
            }
            this.detailMaps.push(detailMap);
            detailMap.setParentSpot(this);
        }
        // lastViewedDetailMapの初期化
        if (this.lastViewedDetailMap === undefined && detailMaps.length > 0) {
            this.lastViewedDetailMap = detailMaps[0];
        }
    }

    /**
     * parentMapとして引数のmapを持っているか判定する
     * @param map 判定対象のmap
     * @return mapがparentMapであるならばtrue, そうでなければfalse
     */
    public hasParentMap(map: Map): boolean {
        return this.parentMap === map;
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

    /**
     * 詳細mapがすでに登録済みかを判定する
     * @param detailMap 判定対象のmap
     * @return すでに登録済みならtrue, 未登録ならばfalse
     */
    public hasDetailMap(detailMap: Map): boolean {
        return this.detailMaps.includes(detailMap);
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
