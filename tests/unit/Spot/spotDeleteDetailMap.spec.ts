import Spot from '@/Spot/Spot.ts';
import Map from '@/Map/Map.ts';

describe('Spotクラスの詳細マップ削除のテスト', () => {
    let spot: Spot;
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    beforeEach(() => {
        spot = new Spot(0, 'testSpot', testCoord);
        const testDetailMaps = [];
        for (let i = 0; i < 5; i++) {
            testDetailMaps.push(new Map(i, 'testMap', testBounds));
        }
        (spot as any).detailMaps = testDetailMaps;
    });

    it('指定した詳細マップを削除する', () => {
        // 削除前に登録されている詳細マップの数は5個
        expect(spot.getDetailMaps().length).toBe(5);
        const deleteTargetId: number = 3;
        spot.deleteDetailMap(deleteTargetId);
        expect(spot.getDetailMaps().length).toBe(4);
        expect(spot.getDetailMaps().find((m: Map) => m.getId() === deleteTargetId)).toBeUndefined();
    });

    it('指定したidを持つ詳細マップを持たない場合は何もしない', () => {
        expect((spot as any).detailMaps.length).toBe(5);
        spot.deleteDetailMap(999);
        expect((spot as any).detailMaps.length).toBe(5);
    });
});
