import MapDataConverter from '@/utils/MapDataConverter';
import { sampleMaps } from '@/store/modules/sampleMaps';
import { initMap } from '@/store/modules/MapViewModule/MapViewState';
import Map from '@/Map/Map.ts';

describe('MapDataConverterのテスト', () => {
    const rootMap: Map = initMap(sampleMaps);
    const js = MapDataConverter.tree2json(rootMap);
    console.log(js);
    console.log(MapDataConverter.json2tree(js));

    it('test', () => {
        // hi
    });
});
