import Spot from '@/Spot/Spot.ts';
import { Bounds } from '@/store/types';

export default class TestMap {
    // 必須
    private id!: number;
    private name!: string;
    private spots!: Spot[];
    private bounds!: Bounds;
    // オプジョナル
    private parentSpot?: Spot;

    // parentSpotはオプション引数
    constructor(id: number, name: string, spots: Spot[], bounds: Bounds, parentSpot?: Spot) {
        this.id = id;
        this.name = name;
        this.bounds = bounds;
        this.spots = spots;
        this.parentSpot = parentSpot;
    }
}
