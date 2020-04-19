import { RawMap } from '@/store/types';
import { testMapViewState3 } from '../../../resources/testMapViewState3';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import { createMapInstance, createSpotInstance, toMapTree } from '@/store/modules/MapViewmodule/MapViewState.ts';

describe('MapViewState.tsのテスト', () => {
    it('createMapInstanceがMap型を返す', () => {
        const testRawMap = testMapViewState3.maps;
        const testRawMapData = testRawMap[0];
        const testMapInstance = createMapInstance(testRawMapData);
        const expectMapProperty = ['id', 'name', 'bounds', 'floorName', 'parentSpot', 'spots'];
        const expectMapId = testRawMapData.id;
        const expectMapName = testRawMapData.name;
        const expectMapBounds = testRawMapData.bounds;
        expect(Object.keys(testMapInstance)).toStrictEqual(expectMapProperty);
        expect((testMapInstance as any).id).toStrictEqual(expectMapId);
        expect((testMapInstance as any).name).toStrictEqual(expectMapName);
        expect((testMapInstance as any).bounds).toStrictEqual(expectMapBounds);
    });
    it('createSpotInstanceがSpot型を返す', () => {
        const testRawMap = testMapViewState3.maps;
        const testRawMapData = testRawMap[0];
        const testSpotInstance = createSpotInstance(testRawMapData.spots[0]);
        const expectSpotProperty = ['id', 'name', 'coordinate', 'shape', 'floorName', 'description', 'attachment', 'parentMap', 'detailMaps'];
        const expectSpotId = testRawMapData.spots[0].id;
        const expectSpotName = testRawMapData.spots[0].name;
        const expectSpotCoordinate = testRawMapData.spots[0].coordinate;
        expect(Object.keys(testSpotInstance)).toStrictEqual(expectSpotProperty);
        expect((testSpotInstance as any).id).toStrictEqual(expectSpotId);
        expect((testSpotInstance as any).name).toStrictEqual(expectSpotName);
        expect((testSpotInstance as any).coordinate).toStrictEqual(expectSpotCoordinate);
    });
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

