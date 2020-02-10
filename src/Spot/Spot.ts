import { Coordinate, Shape } from '@/store/types.ts';
import Map from '@/Map/Map.ts';

export default class Spot {
    constructor(private id: number,
                private name: string,
                private coordinate: Coordinate,
                private parentMap: Map,
                private detailMaps: Map[],
                private shape?: Shape,
                private floorName?: string,
                private description?: string,
                private attachment?: [{name: string, url: string}]) {
    }
}
