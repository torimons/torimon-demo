import { Coordinate, Shape } from '@/store/types.ts';
import Map from '@/Map/Map.ts';

export default class Spot {
    // 必須
    private id!: number;
    private name!: string;
    private coordinate!: Coordinate;
    private parentMap!: Map;
    // オプジョナル
    private shape?: Shape;
    private floorName?: string;
    private detailMapLevelNames?: string[];
    private description?: string;
    private attachment?: [
        {
            name: string,
            url: string,
        }
    ];

    constructor(id: number, name: string, coordinate: Coordinate, parentMap: Map,
                shape?: Shape, floorName?: string, detailMapLevelNames?: string[],
                description?: string, attachment?: [{name: string, url: string}]) {
        this.id = id;
        this.name = name;
        this.coordinate = coordinate;
        this.parentMap = parentMap;
        this.shape = shape;
        this.floorName = floorName;
        this.detailMapLevelNames = detailMapLevelNames;
        this.description = description;
        this.attachment = attachment;
    }
}
