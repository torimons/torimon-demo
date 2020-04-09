import { RawMapData } from '@/store/types';
import { testMapViewState2 } from '../../../resources/testMapViewState2';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import { initMapsVer2 } from '@/store/modules/MapViewmodule/MapViewState.ts';

const testRawMapData = testMapViewState2.maps;
const testRootMap = new Map(
    testRawMapData[0].id,
    testRawMapData[0].name,
    testRawMapData[0].bounds,
);
for (const spotData of testRawMapData[0].spots) {
    const spot = new Spot(
        spotData.id,
        spotData.name,
        spotData.coordinate,
        spotData.shape,
        spotData.floorName,
        spotData.description,
        spotData.attachment,
        );
    testRootMap.addSpots([spot]);
    spot.setParentMap(testRootMap);
    for (const detailMapId of spotData.detailMapIds) {
        const detailMap = testRawMapData.find((m: RawMapData) => m.id === detailMapId);
        if (detailMap === undefined) {
            throw new Error('Illegal map id on sampleMaps.');
        }
        const childMap = new Map(detailMap.id, detailMap.name, detailMap.bounds);
        spot.addDetailMaps([childMap]);
        childMap.setParentSpot(spot);
        for (const detailMapSpotData of detailMap.spots) {
            const childSpotData = new Spot(
                detailMapSpotData.id,
                detailMapSpotData.name,
                detailMapSpotData.coordinate,
                detailMapSpotData.shape,
                detailMapSpotData.floorName,
                detailMapSpotData.description,
                detailMapSpotData.attachment,
                );
            childMap.addSpots([childSpotData]);
            childSpotData.setParentMap(childMap);
        }
    }
}

describe('initMapsVer2のテスト', () => {
    it('initMapsVer2がRawMapDataを受け取ってMap型を返す', () => {
        const testMapData: RawMapData[] = testMapViewState2.maps;
        const actualMap: Map = initMapsVer2(testMapData);
        const expectedMap: Map = testRootMap;
        // console.log(actual);
        // console.log((actual as any).spots[0]);
        // console.log((actual as any).spots[2]);
        expect(actualMap).toStrictEqual(expectedMap);
    });
});
