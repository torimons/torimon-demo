import { RawMap } from '@/store/types';
import { testMapViewState2 } from '../../../resources/testMapViewState2';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import { toMapTree } from '@/store/modules/MapViewmodule/MapViewState.ts';

describe('toMapTreeのテスト', () => {
    // 関数内のexpect外す
    function createInstance(expectMapData: RawMap): Map{
        const Mapinstance = new Map(
            expectMapData.id,
            expectMapData.name,
            expectMapData.bounds,
        );
        const expectSpotData = expectMapData.spots[0];
        const SpotInstance = new Spot(
            expectSpotData.id, 
            expectSpotData.name, 
            expectSpotData.coordinate,
            expectSpotData.shape,
            expectSpotData.floorName,
            expectSpotData.description,
            expectSpotData.attachment,
        );
        expectMap.addSpots([expectSpot]);
        expectSpot.setParentMap(expectMap);
        return expectMap; 
    }
    it('toMapTreeがRawMapを受け取ってMap型を返す', () => {
        const testMapData: RawMap[] = testMapViewState2.maps;
        const actualMap: Map = toMapTree(testMapData);
        const expectRawMap = testMapViewState2.maps
        const expectRootMapData = expectRawMap[0];
        const expectRootMap = new Map(
            expectRootMapData.id,
            expectRootMapData.name,
            expectRootMapData.bounds,
        );
        const expectSpotData = expectRootMapData.spots[0];
        const expectSpot = new Spot(
            expectSpotData.id, 
            expectSpotData.name, 
            expectSpotData.coordinate,
            expectSpotData.shape,
            expectSpotData.floorName,
            expectSpotData.description,
            expectSpotData.attachment,
        );
        const expectDetailMapData = expectRawMap[1];
        const expectDetailMap = new Map(
            expectDetailMapData.id,
            expectDetailMapData.name,
            expectDetailMapData.bounds,
        );
        const expectDetailMapSpotData = expectDetailMapData.spots[0];
        const expectDetailMapSpot = new Spot(
            expectDetailMapSpotData.id, 
            expectDetailMapSpotData.name, 
            expectDetailMapSpotData.coordinate,
            expectDetailMapSpotData.shape,
            expectDetailMapSpotData.floorName,
            expectDetailMapSpotData.description,
            expectDetailMapSpotData.attachment,
        );
        expect(actualMap).toStrictEqual(expectRootMap);
    });
});
