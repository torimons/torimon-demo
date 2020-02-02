import Spot from '@/Spot/Spot.ts';
import { Bounds } from '@/store/types';

export default class TestMap {
    constructor(private id: number,
                private name: string,
                private spots: Spot[],
                private bounds: Bounds,
                private parentSpot?: Spot) {
    }
}
