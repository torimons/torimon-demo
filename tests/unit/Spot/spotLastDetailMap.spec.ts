import Spot from '@/Spot/Spot.ts';
import Map from '@/Map/Map.ts';

describe('lastViewedDetailMap関連のテスト', () => {
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('getLastViewedDetailMapメソッドのテスト', () => {
        const spot = new Spot(0, 'testSpot', testCoord);
        const expectedMap = new Map(0, 'testMap', testBounds);
        (spot as any).lastViewedDetailMap = expectedMap;
        const actualMap = spot.getLastViewedDetailMap();
        expect(actualMap).toStrictEqual(expectedMap);
    });

    it('setLastViewedDetailMapメソッドのテスト', () => {
        const spot = new Spot(0, 'testSpot', testCoord);
        const expectedMap = new Map(0, 'testMap', testBounds);
        spot.setLastViewedDetailMap(expectedMap);
        expect(spot.getLastViewedDetailMap()).toStrictEqual(expectedMap);
    });
});
