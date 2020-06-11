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
     * スポットのnameを返す
     * @return スポットのname
     */
    public getName(): string {
        return this.name;
    }

    /**
     * 親マップをセットする
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
     * 検索条件を満たすかを判定する
     * @param keyword
     */
    public isMatchToKeywords(keywordsRegExp: RegExp): boolean {
        let searchTargetString: string = this.name;
        const parentMap: Map | undefined = this.parentMap;
        if (parentMap !== undefined) {
            const parentSpot = parentMap.getParentSpot();
            if (parentSpot !== undefined) {
                searchTargetString += parentSpot.getName();
            }
        }
        if (this.description !== undefined) {
            searchTargetString += this.description;
        }
        // RegExp.test(target:str)は、targetにRegExpがマッチした場合にtrue, マッチしない場合falseを返す.
        return keywordsRegExp.test(searchTargetString);
    }
}
