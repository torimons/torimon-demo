import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import { Bounds } from '@/store/types';

describe('Mapクラスのgetterのテスト', () => {
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };

    it('getIdのテスト', () => {
        const map = new Map(1, 'testMap', testBounds, 'testFloorName');
        const actualMapId: number = map.getId();
        const expectMapId = 1;
        expect(actualMapId).toEqual(expectMapId);
    });

    it('getNameのテスト', () => {
        const map = new Map(1, 'testMap', testBounds, 'testFloorName');
        const actualMapName: string = map.getName();
        const expectMapName = 'testMap';
        expect(actualMapName).toEqual(expectMapName);
    });

    it('getBoundsのテスト', () => {
        const map = new Map(1, 'testMap', testBounds, 'testFloorName');
        const actualMapBounds: Bounds = map.getBounds();
        const expectMapBounds = testBounds;
        expect(actualMapBounds).toEqual(expectMapBounds);
    });

    it('getFloorNameでfloorNameを取得する', () => {
        const testMap = new Map(0, 'testMap', testBounds, 'testFloorName');
        const actualFloorName = testMap.getFloorName();
        expect(actualFloorName).toBe('testFloorName');
    });

    it('floorNameが初期化されていない場合, getFloorNameがundefinedを返す', () => {
        const map = new Map(1, 'testMap', testBounds);
        const actualMapFloorName = map.getFloorName();
        const expectMapFloorName = undefined;
        expect(actualMapFloorName).toEqual(expectMapFloorName);
    });
});
