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
     * 親mapをセットし,セットしたmapの子spotに自身を追加する.
     * すでにセット済みであればセットしない。
     * @param parentMap セットする親map
     */
    public setParentMap(parentMap: Map): void {
        if (this.hasParentMap()) {
            return;
        }
        this.parentMap = parentMap;
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
    }

    /**
     * parentMapを持つかどうかを判定する
     * @return parentMapを持つならtrue, 持っていなければfalse
     */
    public hasParentMap(): boolean {
        return this.parentMap !== undefined;
    }

    /**
     * 詳細mapがすでに登録済みかを判定する
     * @param detailMap 判定対象のmap
     * @return すでに登録済みならtrue, 未登録ならばfalse
     */
    public hasDetailMap(detailMap: Map): boolean {
        return this.detailMaps.includes(detailMap);
    }
}
