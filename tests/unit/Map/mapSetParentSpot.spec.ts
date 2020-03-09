import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

describe('Mapクラスの親スポット登録のテスト', () => {
    let map: Map;
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('指定した親スポットがparentSpotに登録される', () => {
        map = new Map(0, 'testMap', testBounds, undefined);
        const testSpot = new Spot(0, 'testSpot', testCoord, undefined, undefined, undefined);
        // 登録
        map.setParentSpot(testSpot);
        expect((map as any).parentSpot).toBe(testSpot);
    });
});
