import Spot from '@/Spot/Spot.ts';
import Map from '@/Map/Map.ts';

describe('Spotクラスの詳細マップ登録のテスト', () => {
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('指定した詳細マップがdetailMapsに追加される', () => {
        const testDetailMaps = [];
        for (let i = 0; i < 5; i++) {
            testDetailMaps.push(new Map(i, 'testMap', testBounds));
        }
        const spot = new Spot(0, 'testSpot', testCoord);
        // 登録
        spot.addDetailMaps(testDetailMaps);
        expect((spot as any).detailMaps).toStrictEqual(testDetailMaps);
    });

    it('詳細マップ追加時にlastViewedDetailMapが初期化されていない場合初期化される', () => {
        const testDetailMaps: Map[] = [new Map(0, 'testMap', testBounds)];
        const spot = new Spot(0, 'testSpot', testCoord);
        // 登録
        spot.addDetailMaps(testDetailMaps);
        expect(spot.getLastViewedDetailMap()).toStrictEqual(testDetailMaps[0]);
    });

    it('詳細マップ追加時にlastViewedDetailMapが初期化されている場合初期化されない', () => {
        const testDetailMaps: Map[] = [new Map(0, 'testMap', testBounds)];
        const testDetailMaps2: Map[] = [new Map(1, 'testMap2', testBounds)];
        const spot = new Spot(0, 'testSpot', testCoord);
        // 登録
        spot.addDetailMaps(testDetailMaps);
        spot.addDetailMaps(testDetailMaps2);
        expect(spot.getLastViewedDetailMap()).not.toStrictEqual(testDetailMaps2[0]);
        expect(spot.getLastViewedDetailMap()).toStrictEqual(testDetailMaps[0]);
    });
});
