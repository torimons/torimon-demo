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
     * 親spotをセットし,セットしたspotのdetailMapに自身を追加する.
     * すでにセット済みであればセットしない.
     * @param parentSpot セットする親スポット
     */
    public setParentSpot(parentSpot: Spot): void {
        if (this.hasParentSpot()) {
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
     * parentSpotを持つかどうかを判定する
     * @return parentSpotを持つならtrue, 持っていなければfalse
     */
    public hasParentSpot(): boolean {
        return this.parentSpot !== undefined;
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

}
