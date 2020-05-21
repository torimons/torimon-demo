import { RawMap } from '@/store/types';
import { testMapViewState3 } from '../../../resources/testMapViewState3';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import { createMapInstance, createSpotInstance, initMap } from '@/store/modules/NewMapViewModule/MapViewState.ts';

describe('初期化に利用する関数のテスト', () => {
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
});

describe('地図データ初期化のテスト', () => {
    /**
     * テストデータの構造は以下の通り。
     * rootMap(id:0) -> rootSpot(id:0) -> detailMap(id:1) -> detailSpot(id:0)
     * Mapインスタンス、Spotインスタンスそれぞれについてプロパティを検証する。
     */
    const testMapData: RawMap[] = testMapViewState3.maps;
    // rootMap
    const actualRootMap: Map = initMap(testMapData);
    const expectRootMapData = testMapData[0];
    // rootSpot
    const actualRootSpot = (actualRootMap as any).spots[0];
    const expectedRootSpotData = expectRootMapData.spots[0];
    // detailMap
    const actualDetailMap = (actualRootMap as any).spots[0].detailMaps[0];
    const expectDetailMapData = testMapData[1];
    // detailSpot
    const actualDetailSpot = actualDetailMap.spots[0];
    const expectedDetailSpotData = expectDetailMapData.spots[0];

    it('rootMapのプロパティ検証', () => {
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
    });

    it('rootMapが持つSpotのプロパティ検証', () => {
        const actualRootSpotProperties = {
            id: actualRootSpot.id,
            name: actualRootSpot.name,
            coordinate: actualRootSpot.coordinate,
            floorName: actualRootSpot.floorName,
            parentMapName: actualRootSpot.parentMap.name,
            detailMapNum: actualRootSpot.detailMaps.length,
        };
        const expectedRootSpotDataProperties = {
            id: expectedRootSpotData.id,
            name: expectedRootSpotData.name,
            coordinate: expectedRootSpotData.coordinate,
            floorName: undefined,
            parentMapName: 'Kyudai',
            detailMapNum: 1,
        };
        expect(actualRootSpotProperties).toStrictEqual(expectedRootSpotDataProperties);
    });

    it('detailMapのプロパティ検証', () => {
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
    });

    it('detailMapが持つSpotのプロパティ検証', () => {
        const actualDetailSpotProperties = {
            id: actualDetailSpot.id,
            name: actualDetailSpot.name,
            coordinate: actualDetailSpot.coordinate,
            floorName: actualDetailSpot.floorName,
            parentMapName: actualDetailSpot.parentMap.name,
            detailMapNum: actualDetailSpot.detailMaps.length,
        };
        const expectedDetailSpotDataProperties = {
            id: expectedDetailSpotData.id,
            name: expectedDetailSpotData.name,
            coordinate: expectedDetailSpotData.coordinate,
            floorName: '1F',
            parentMapName: 'SougouGakusyuPlaza_1F',
            detailMapNum: 0,
        };
        expect(actualDetailSpotProperties).toStrictEqual(expectedDetailSpotDataProperties);
    });
});
