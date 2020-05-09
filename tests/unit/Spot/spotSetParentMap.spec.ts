import Spot from '@/Spot/Spot.ts';
import Map from '@/Map/Map.ts';

describe('Spotクラスの親マップ登録のテスト', () => {
    let spot: Spot;
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('setParentMapで親マップが登録され、floorNameがセットされる', () => {
        spot = new Spot(0, 'testSpot', testCoord, undefined, undefined, undefined, undefined);
        const testMap = new Map(0, 'testMap', testBounds, 'testFloorName');
        // 登録
        spot.setParentMap(testMap);
        expect((spot as any).parentMap).toBe(testMap);
        expect((spot as any).floorName).toBe('testFloorName');
    });

    it('parentMap登録時に、parentMapの子spotとして自身を登録する', () => {
        const testMap: Map = new Map(0, 'testMap', testBounds, undefined);
        const testSpot = new Spot(0, 'testSpot', testCoord, undefined, undefined, undefined);
        testSpot.setParentMap(testMap);
        expect((testMap as any).spots.includes(testSpot)).toBe(true);
    });

    it('親マップが登録済みかどうかをhasParentMapにより判定する', () => {
        const testMap: Map = new Map(0, 'testMap', testBounds, undefined);
        const testSpot: Spot = new Spot(0, 'testSpot', testCoord, undefined, undefined, undefined, undefined);
        // 登録前の判定
        expect(testSpot.hasParentMap(testMap)).toBe(false);
        // 登録後の判定
        (testSpot as any).parentMap = testMap;
        expect(testSpot.hasParentMap(testMap)).toBe(true);
    });
});
