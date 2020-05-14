import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

describe('Spotクラス，searchMap', () => {
    let spot;
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('子マップがないor見つからない場合にnullを返す', () => {
        const searchId = 0;
        // 子マップなしの時
        spot = new Spot(0, 'testSpot', testCoord);
        expect(spot.searchMap(searchId)).toBe(null);

        // 子マップはあるが、検索対象が見つからない場合
        const notTargetId = 999;
        const notTargetMap = new Map(notTargetId, 'notTargetMap', testBounds);
        spot.addDetailMaps([notTargetMap]);
        expect(spot.searchMap(searchId)).toBe(null);
    });

    it('検索対象マップが子マップに存在する場合にそのマップを返す', () => {
        const targetId = 0;
        spot = new Spot(0, 'testMap', testCoord);
        // 検索したいスポット生成，登録
        const targetMap = new Map(targetId, 'targetMap', testBounds);
        spot.addDetailMaps([targetMap]);
        expect(spot.searchMap(targetId)).toBe(targetMap);
    });

    it('検索対象マップが孫スポットに存在する場合にそのマップを返す', () => {
        // MapクラスのsearchMapをモック
        const targetId = 999;
        spot = new Spot(0, 'testMap', testCoord);
        const targetMap = new Map(999, 'targetMap', testBounds);
        const childMap = new Map(0, 'detailMap', testBounds);
        (spot as any).detailMaps = [childMap];
        // MapクラスのsearchMapをモック
        childMap.searchMap = jest.fn(() => {
            return targetMap;
        });
        expect(spot.searchMap(targetId)).toBe(targetMap);
    });
});

describe('Spotクラス，searchSpot', () => {
    let spot;
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('検索対象が見つからない場合nullを返す', () => {
        const searchId = 0;
        spot = new Map(0, 'testMap', testBounds);
        expect(spot.searchSpot(searchId)).toBe(null);
    });

    it('Spotの子マップの子孫に検索対象スポットが存在する場合', () => {
        const targetId = 999;
        spot = new Spot(0, 'testMap', testCoord);
        // 検索対象マップ
        const childMap = new Map(0, 'childMap', testBounds);
        (spot as any).detailMaps = [childMap];
        // ルートマップの孫スポット
        const targetSpot = new Spot(targetId, 'targetSpot', testCoord);
        (childMap as any).spots = [targetSpot];
        // スポット側のsearchMapをモックして検索対象マップを返すように
        targetSpot.searchMap = jest.fn(() => {
            return childMap;
        });
        expect(spot.searchSpot(targetId)).toBe(targetSpot);
    });
});
