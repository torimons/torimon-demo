import { RawMap } from '@/store/types';
import { testMapViewState3 } from '../../../resources/testMapViewState3';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import { createMapInstance, createSpotInstance, toMapTree } from '@/store/modules/MapViewModule/MapViewState.ts';

describe('MapViewState.tsのテスト', () => {
    it('createMapInstanceがMap型を返す', () => {
        const testRawMap = testMapViewState3.maps;
        const testRawMapData = testRawMap[1];
        const testMapInstance = createMapInstance(testRawMapData);
        const expectedMapProperties = {
            id: testRawMapData.id,
            name: testRawMapData.name,
            bounds: testRawMapData.bounds,
            floorName: testRawMapData.floorName,
        };
        const actualMapProperties = {
            id: (testMapInstance as any).id,
            name: (testMapInstance as any).name,
            bounds: (testMapInstance as any).bounds,
            floorName: (testMapInstance as any).floorName,
        };
        expect(actualMapProperties).toStrictEqual(expectedMapProperties);
    });
    it('createSpotInstanceがSpot型を返す', () => {
        const testRawMap = testMapViewState3.maps;
        const testRawMapData = testRawMap[0];
        const testSpotInstance = createSpotInstance(testRawMapData.spots[0]);
        const expectedSpotProperties = {
            id: testRawMapData.spots[0].id,
            name: testRawMapData.spots[0].name,
            coordinate: testRawMapData.spots[0].coordinate,
        };
        const actualSpotProperties = {
            id: (testSpotInstance as any).id,
            name: (testSpotInstance as any).name,
            coordinate: (testSpotInstance as any).coordinate,
        };
        expect(actualSpotProperties).toStrictEqual(expectedSpotProperties);
    });

    it('toMapTreeがRawMapを受け取ってMap型の木構造を返す', () => {
        const testMapData: RawMap[] = testMapViewState3.maps;
        const actualRootMap: Map = toMapTree(testMapData);
        const expectRawMap = testMapViewState3.maps;
        const expectRootMapData = expectRawMap[0];

        // rootMapのプロパティ検証
        const actualRootMapProperties = {
            id: (actualRootMap as any).id,
            name: (actualRootMap as any).name,
            bounds: (actualRootMap as any).bounds,
            floorName: (actualRootMap as any).floorName,
            parentSpot: (actualRootMap as any).parentSpot,
            spotsNum: (actualRootMap as any).spots.length,
        };
        const expectedRootMapProperties = {
            id: expectRootMapData.id,
            name: expectRootMapData.name,
            bounds: expectRootMapData.bounds,
            floorName: expectRootMapData.floorName,
            parentSpot: undefined,
            spotsNum: 1,
        };
        expect(actualRootMapProperties).toStrictEqual(expectedRootMapProperties);

        // rootMapのSpotのプロパティ検証
        const actualSpot = (actualRootMap as any).spots[0];
        const actualSpotProperties = {
            id: actualSpot.id,
            name: actualSpot.name,
            coordinate: actualSpot.coordinate,
            floorName: actualSpot.floorName,
            parentMapName: actualSpot.parentMap.name,
            detailMapNum: actualSpot.detailMaps.length,
        };
        const expectedSpot = expectRootMapData.spots[0];
        const expectedSpotProperties = {
            id: expectedSpot.id,
            name: expectedSpot.name,
            coordinate: expectedSpot.coordinate,
            floorName: undefined,
            parentMapName: 'Kyudai',
            detailMapNum: 1,
        };
        expect(actualSpotProperties).toStrictEqual(expectedSpotProperties);

        // detailMapのプロパティ検証
        const actualDetailMap = (actualRootMap as any).spots[0].detailMaps[0];
        const expectDetailMapData = expectRawMap[1];
        const actualDetailMapProperties = {
            id: actualDetailMap.id,
            name: actualDetailMap.name,
            bounds: actualDetailMap.bounds,
            floorName: actualDetailMap.floorName,
            parentSpotName: actualDetailMap.parentSpot.name,
            spotsNum: actualDetailMap.spots.length,
        };
        const expectedDetailMapProperties = {
            id: expectDetailMapData.id,
            name: expectDetailMapData.name,
            bounds: expectDetailMapData.bounds,
            floorName: expectDetailMapData.floorName,
            parentSpotName: 'SougouGakusyuPlaza',
            spotsNum: 1,
        };
        expect(actualDetailMapProperties).toStrictEqual(expectedDetailMapProperties);

        // detailMapのSpotのプロパティ検証
        const actualDetailSpot = actualDetailMap.spots[0];
        const actualDetailSpotProperties = {
            id: actualDetailSpot.id,
            name: actualDetailSpot.name,
            coordinate: actualDetailSpot.coordinate,
            floorName: actualDetailSpot.floorName,
            parentMapName: actualDetailSpot.parentMap.name,
            detailMapNum: actualDetailSpot.detailMaps.length,
        };
        const expectedDetailSpot = expectDetailMapData.spots[0];
        const expectedDetailSpotProperties = {
            id: expectedDetailSpot.id,
            name: expectedDetailSpot.name,
            coordinate: expectedDetailSpot.coordinate,
            floorName: '1F',
            parentMapName: 'SougouGakusyuPlaza_1F',
            detailMapNum: 0,
        };
        expect(actualDetailSpotProperties).toStrictEqual(expectedDetailSpotProperties);
    });
});
