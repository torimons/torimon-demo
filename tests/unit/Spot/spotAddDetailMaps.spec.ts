import Spot from '@/Spot/Spot.ts';
import Map from '@/Map/Map.ts';

describe('Spotクラスの詳細マップ登録のテスト', () => {
    let spot: Spot;
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('指定した詳細マップがdetailMapsに追加される', () => {
        spot = new Spot(0, 'testSpot', testCoord, undefined, undefined, undefined, undefined);
        const testDetailMaps = [];
        for (let i = 0; i < 5; i++) {
            testDetailMaps.push(new Map(i, 'testMap', testBounds, undefined));
        }
        // 登録
        spot.addDetailMaps(testDetailMaps);
        expect((spot as any).detailMaps).toStrictEqual(testDetailMaps);
    });
});
