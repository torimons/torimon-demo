import Spot from '@/Spot/Spot.ts';
import Map from '@/Map/Map.ts';

describe('Spotクラスの親マップ登録のテスト', () => {
    let spot: Spot;
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('指定した親マップがparentMapに登録される', () => {
        spot = new Spot(0, 'testSpot', testCoord, undefined, undefined, undefined, undefined);
        const testMap = new Map(0, 'testMap', testBounds, undefined);
        // 登録
        spot.setParentMap(testMap);
        expect((spot as any).parentMap).toBe(testMap);
    });
});
