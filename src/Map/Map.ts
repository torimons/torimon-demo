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
     * @return id 自身のid
     */
    public getId(): number {
        return this.id;
    }

    /**
     * 自身が持つspotを返す
     */
    public getSpots(): Spot[] {
        return this.spots;
    }

    /**
     * 親スポットを返す
     * @return parentSpot 自身の親スポット，なければundefined
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
}
