import Spot from '@/Spot/Spot.ts';
import { Bounds } from '@/store/types';

export default class Map {
    private parentSpot: Spot | undefined = undefined;
    private spots: Spot[] = [];

    constructor(private id: number,
                private name: string,
                private bounds: Bounds,
                private floorName?: string,
                private description?: string) {
    }

    /**
     * 親スポットが存在すれば親スポットを返す
     * @return 親スポット．存在しない場合undefined
     */
    public getParentSpot(): Spot | undefined {
        return this.parentSpot;
    }

    /**
     * 親スポットをセットする
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
     * 検索条件を満たすかを判定する
     * @param keyword
     */
    public isMatchToKeywords(keywordsRegExp: RegExp): boolean {
        let searchTargetString: string = this.name;
        if (this.description !== undefined) {
            searchTargetString += this.description;
        }
        // RegExp.test(target:str)は、targetにRegExpがマッチした場合にtrue, マッチしない場合falseを返す.
        return keywordsRegExp.test(searchTargetString);
    }
}
