import { RawMap } from '@/store/types';
import { testMapViewState3 } from '../../../resources/testMapViewState3';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import { createMapInstance, createSpotInstance, toMapTree } from '@/store/modules/MapViewmodule/MapViewState.ts';

describe('MapViewState.tsのテスト', () => {
    it('toMapTreeがRawMapを受け取ってMap型の木構造を返す', () => {
        const testMapData: RawMap[] = testMapViewState3.maps;
        const actualMap: Map = toMapTree(testMapData);
        const expectRawMap = testMapViewState3.maps;
        const expectRootMapData = expectRawMap[0];
        const expectMapInstance: Map = createMapInstance(expectRootMapData);
        const expectSpot: Spot = createSpotInstance(expectRootMapData.spots[0]);
        expectMapInstance.addSpots([expectSpot]);
        expectSpot.setParentMap(expectMapInstance);
        const expectDetailMapData = expectRawMap[1];
        const expectDetailMapInstance = createMapInstance(expectDetailMapData);
        expectSpot.addDetailMaps([expectDetailMapInstance]);
        expectDetailMapInstance.setParentSpot(expectSpot);
        const expectDetailSpot = createSpotInstance(expectDetailMapData.spots[0]);
        expectDetailMapInstance.addSpots([expectDetailSpot]);
        expectDetailSpot.setParentMap(expectDetailMapInstance);
        expect(actualMap).toStrictEqual(expectMapInstance);
    });
});

