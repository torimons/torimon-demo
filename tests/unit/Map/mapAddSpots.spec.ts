import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

describe('Mapクラスのスポット登録のテスト', () => {
    let map: Map;
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('指定したスポットがspotsに登録される', () => {
        map = new Map(0, 'testMap', testBounds, undefined);
        const testSpots = [];
        for (let i = 0; i < 5; i++) {
            testSpots.push(new Spot(i, 'testSpot', testCoord, undefined, undefined, undefined, undefined));
        }
        // 登録
        map.addSpots(testSpots);
        expect((map as any).spots).toStrictEqual(testSpots);
    });
});
