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
     * 自身のidを返す
     * @return 自身のid
     */
    public getId(): number {
        return this.id;
    }

    /**
     * マップの名前を返す
     * @return マップ名
     */
    public getName(): string {
        return this.name;
    }

    /**
     * マップが持つスポットを返す
     * @return スポットの配列
     */
    public getSpots(): Spot[] {
        return this.spots;
    }

    /**
     * マップが表現する範囲を返す
     * @return マップの範囲
     */
    public getBounds(): Bounds {
        return this.bounds;
    }

    /**
     * 親スポットが存在すれば親スポットを返す
     * @return 親スポット．存在しない場合undefined
     */
    public getParentSpot(): Spot | undefined {
        return this.parentSpot;
    }

    /**
     * 親spotをセットし,セットしたspotのdetailMapに自身を追加する.
     * @param parentSpot セットする親スポット
     */
    public setParentSpot(parentSpot: Spot): void {
        if (this.hasParentSpot(parentSpot)) {
            return;
        }
        this.parentSpot = parentSpot;
        parentSpot.addDetailMaps([this]);
    }

    /**
     * spotを追加し,追加したspotのparentMapとして自身をセットする.
     * すでに追加済みであれば追加しない.
     * @param spots 追加するspotの配列
     */
    public addSpots(spots: Spot[]): void {
        for (const spot of spots) {
            if (this.hasSpot(spot)) {
                continue;
            }
            this.spots.push(spot);
            spot.setParentMap(this);
        }
    }

    /**
     * parentSpotとして引数のspotを持っているか判定する
     * @param spot 判定対象のspot
     * @return spotがparentSpotであるならばtrue, そうでなければfalse
     */
    public hasParentSpot(spot: Spot): boolean {
        return this.parentSpot === spot;
    }

    /**
     * spotがすでに登録済みかを判定する
     * @param spot 判定対象のspot
     * @return すでに登録済みならtrue, 未登録ならばfalse
     */
    public hasSpot(spot: Spot): boolean {
        return this.spots.includes(spot);
    }

    /**
     * floorNameを返す
     * @return 階層名
     */
    public getFloorName(): string | undefined {
        return this.floorName;
    }

    /**
     * 指定したidをもつ子孫スポットを探す
     * @param id 指定するid
     * @return 該当するスポット，またはnull
     */
    public findSpot(id: number): Spot | null {
        for (const spot of this.spots) {
            const foundSpot: Spot | null = spot.findSpot(id);
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
        if (this.id === id) {
            return this;
        }
        for (const spot of this.spots) {
            const foundMap: Map | null = spot.findMap(id);
            if (foundMap !== null) {
                return foundMap;
            }
        }
        return null;
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
