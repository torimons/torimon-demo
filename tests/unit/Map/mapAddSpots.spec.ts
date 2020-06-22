import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

describe('Mapクラスのスポット登録のテスト', () => {
    let map: Map;
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('addSpotにより指定したスポットがspotsに登録される', () => {
        map = new Map(0, 'testMap', testBounds);
        const expectSpot = new Spot(0, 'expectSpot', testCoord);
        map.addSpot(expectSpot);
        expect(map.getSpots()).toContain(expectSpot);
    });

    it('addSpotにて登録済みspotは重複して登録しない', () => {
        const testMap: Map = new Map(0, 'testMap', testBounds);
        const spotDuplicated: Spot = new Spot(0, 'testSpot', testCoord);
        testMap.addSpot(spotDuplicated);
        testMap.addSpot(spotDuplicated);
        expect(testMap.getSpots()).toContain(spotDuplicated);
        expect(testMap.getSpots().length).toBe(1);
    });

    it('mapにspotを登録する際に、spotのparentMapとして自身をセットする', () => {
        const testMap: Map = new Map(0, 'testMap', testBounds);
        const testSpot: Spot = new Spot(0, 'testSpot', testCoord);
        testMap.addSpot(testSpot);
        expect((testSpot as any).parentMap).toStrictEqual(testMap);
    });

    it('子spotが登録済みかどうかをhasSpotにより判定する', () => {
        const testMap: Map = new Map(0, 'testMap', testBounds);
        const testSpot: Spot = new Spot(0, 'testSpot', testCoord);
        // 登録前の判定
        expect(testMap.hasSpot(testSpot)).toBe(false);
        // 登録後の判定
        (testMap as any).spots.push(testSpot);
        expect(testMap.hasSpot(testSpot)).toBe(true);
    });

    it('addSpotsにより複数のスポットがspotsに登録される', () => {
        map = new Map(0, 'testMap', testBounds);
        const testSpots = [];
        for (let i = 0; i < 5; i++) {
            testSpots.push(new Spot(i, 'testSpot', testCoord));
        }
        map.addSpots(testSpots);
        expect(map.getSpots()).toStrictEqual(testSpots);
    });
});
