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
        expect((map as any).parentSpot).toStrictEqual(testSpot);
    });

    it('異なるparentSpotの登録は禁止する', () => {
        map = new Map(0, 'testMap', testBounds, undefined);
        const testSpot = new Spot(0, 'testSpot', testCoord, undefined, undefined, undefined);
        const anotherSpot = new Spot(1, 'testSpot', testCoord, undefined, undefined, undefined);
        // 登録
        map.setParentSpot(testSpot);
        map.setParentSpot(anotherSpot);
        // 最初に登録されたparentSpotが登録されたままになる
        expect((map as any).parentSpot).toStrictEqual(testSpot);
    });

    it('parentSpot登録時に、parentSpotのdetailMapとして自身を登録する', () => {
        map = new Map(0, 'testMap', testBounds, undefined);
        const testSpot = new Spot(0, 'testSpot', testCoord, undefined, undefined, undefined);
        map.setParentSpot(testSpot);
        expect((testSpot as any).detailMaps.includes(map)).toBe(true);
    });

    it('親spotが登録済みかどうかをhasParentSpotにより判定する', () => {
        const testMap: Map = new Map(0, 'testMap', testBounds, undefined);
        const testSpot: Spot = new Spot(0, 'testSpot', testCoord, undefined, undefined, undefined, undefined);
        // 登録前の判定
        expect(testMap.hasParentSpot()).toBe(false);
        // 登録後の判定
        (testMap as any).parentSpot = testSpot;
        expect(testMap.hasParentSpot()).toBe(true);
    });

    it('getFloorNameでfloorNameを取得する',() => {
        const map = new Map(0, 'testMap', testBounds, 'testFloorName');
        const actualFloorName = map.getFloorName();
        expect(actualFloorName).toBe('testFloorName');
    });
});
