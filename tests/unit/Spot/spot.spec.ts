import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import { Bounds, Coordinate } from '@/store/types';

describe('Spotクラスのgetterのテスト', () => {
    const testCoord = { lat: 0, lng: 0 };

    it('getIdのテスト', () => {
        const testSpot = new Spot(1,'testMap',testCoord,undefined,'testFloorName');
        const actualSpotId: number = testSpot.getId();
        const expectSpotId = 1;
        expect(actualSpotId).toEqual(expectSpotId);
    });

    it('getNameのテスト', () => {
        const testSpot = new Spot(1,'testMap',testCoord,undefined,'testFloorName');
        const actualSpotName: string = testSpot.getName();
        const expectSpotName = 'testMap';
        expect(actualSpotName).toEqual(expectSpotName); 
    });

    it('getCoordinateのテスト', () => {
        const testSpot = new Spot(1,'testMap',testCoord,undefined,'testFloorName');
        const actualSpotCoord: Coordinate = testSpot.getCoordinate();
        const expectSpotCoord = testCoord;
        expect(actualSpotCoord).toEqual(expectSpotCoord); 
    });

    it('getFloorNameでfloorNameを取得する', () => {
        const testSpot = new Spot(1,'testMap',testCoord,undefined,'testFloorName');
        const actualFloorName = testSpot.getFloorName();
        expect(actualFloorName).toBe('testFloorName');
    });

    it('floorNameが初期化されていない場合,', () => {
        const testSpot = new Spot(1,'testMap',testCoord);
        const actualSpotFloorName = testSpot.getFloorName();
        const expectSpotFloorName = undefined;
        expect(actualSpotFloorName).toEqual(expectSpotFloorName); 
    });
});