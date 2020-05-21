import Map from '@/Map/Map.ts';
import { Coordinate } from '@/store/types';

describe('Mapクラス', () => {
    it('calculateCenterがBoundsの中心座標を計算する', () => {
        const testBounds = {
            topL: {lat: 60, lng: 60},
            botR: {lat: 30, lng: 90},
        };
        const acutualCenter: Coordinate = Map.calculateCenter(testBounds);
        const expectCenter: Coordinate = { lat: 45, lng: 75 };
        expect(acutualCenter).toEqual(expectCenter);
    });
});
