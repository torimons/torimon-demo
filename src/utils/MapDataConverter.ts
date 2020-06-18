import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import { initMap } from '@/store/modules/MapViewModule/MapViewState.ts';

export default class MapDataConverter {
    public static json2tree(json: JSON): Map {
        // json to tree
    }

    public static tree2json(rootMap: Map): any {
        return JSON.stringify(rootMap);
    }
}
