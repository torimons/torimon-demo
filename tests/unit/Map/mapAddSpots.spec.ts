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

    it('登録済みspotは重複して登録しない', () => {
        const testMap: Map = new Map(0, 'testMap', testBounds, undefined);
        const testSpots = [];
        for (let i = 0; i < 5; i++) {
            testSpots.push(new Spot(i, 'testSpot', testCoord, undefined, undefined, undefined, undefined));
        }
        const spotDuplicated: Spot = new Spot(0, 'testSpot', testCoord, undefined, undefined, undefined, undefined);
        testSpots.push(spotDuplicated);
        testMap.addSpots(testSpots);
        expect((testMap as any).spots).toStrictEqual(testSpots);
    });

    it('mapにspotを登録する際に、spotのparentMapとして自身をセットする', () => {
        const testMap: Map = new Map(0, 'testMap', testBounds, undefined);
        const testSpot: Spot = new Spot(0, 'testSpot', testCoord, undefined, undefined, undefined, undefined);
        testMap.addSpots([testSpot]);
        expect((testSpot as any).parentMap).toStrictEqual(testMap);
    });

    it('子spotが登録済みかどうかをhasSpotにより判定する', () => {
        const testMap: Map = new Map(0, 'testMap', testBounds, undefined);
        const testSpot: Spot = new Spot(0, 'testSpot', testCoord, undefined, undefined, undefined, undefined);
        // 登録前の判定
        expect(testMap.hasSpot(testSpot)).toBe(false);
        // 登録後の判定
        (testMap as any).spots.push(testSpot);
        expect(testMap.hasSpot(testSpot)).toBe(true);
    });
});
