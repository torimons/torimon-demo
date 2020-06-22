import Map from '@/Map/Map.ts';
import { Coordinate } from '@/store/types';

import { Bounds } from '@/store/types';
import Spot from '@/Spot/Spot';

describe('Mapクラスのgetterのテスト', () => {
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };

    it('calculateCenterがBoundsの中心座標を計算する', () => {
        const testBoundsForCalculateCenter = {
            topL: {lat: 60, lng: 60},
            botR: {lat: 30, lng: 90},
        };
        const acutualCenter: Coordinate = Map.calculateCenter(testBoundsForCalculateCenter);
        const expectCenter: Coordinate = { lat: 45, lng: 75 };
        expect(acutualCenter).toEqual(expectCenter);
    });

    it('getIdのテスト', () => {
        const map = new Map(1, 'testMap', testBounds, 'testFloorName');
        const actualMapId: number = map.getId();
        const expectedMapId = 1;
        expect(actualMapId).toEqual(expectedMapId);
    });

    it('getNameのテスト', () => {
        const map = new Map(1, 'testMap', testBounds, 'testFloorName');
        const actualMapName: string = map.getName();
        const expectedMapName = 'testMap';
        expect(actualMapName).toEqual(expectedMapName);
    });

    it('getBoundsのテスト', () => {
        const map = new Map(1, 'testMap', testBounds, 'testFloorName');
        const actualMapBounds: Bounds = map.getBounds();
        const expectedMapBounds = testBounds;
        expect(actualMapBounds).toEqual(expectedMapBounds);
    });

    it('getFloorNameでfloorNameを取得する', () => {
        const testMap = new Map(0, 'testMap', testBounds, 'testFloorName');
        const actualFloorName = testMap.getFloorName();
        expect(actualFloorName).toBe('testFloorName');
    });

    it('floorNameが初期化されていない場合, getFloorNameがundefinedを返す', () => {
        const map = new Map(1, 'testMap', testBounds);
        const actualMapFloorName = map.getFloorName();
        const expectedMapFloorName = undefined;
        expect(actualMapFloorName).toEqual(expectedMapFloorName);
    });

    it('指定したidの子スポットを削除する', () => {
        const map = new Map(1, 'testMap', testBounds);
        const spot =  new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        map.addSpot(spot);
        map.removeSpot(0);
        const actualSpots = map.getSpots();
        const expectedSpots: Spot[] = [];
        expect(actualSpots).toEqual(expectedSpots);
    });
});
