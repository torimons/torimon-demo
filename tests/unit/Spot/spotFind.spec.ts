import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

describe('Spotクラス，findMap', () => {
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('子マップがないor見つからない場合にnullを返す', () => {
        const targetId = 0;
        // 子マップなしの時
        const spot = new Spot(0, 'testSpot', testCoord);
        expect(spot.findMap(targetId)).toBe(null);

        // 子マップはあるが、検索対象が見つからない場合
        const notTargetId = 999;
        const notTargetMap = new Map(notTargetId, 'notTargetMap', testBounds);
        spot.addDetailMaps([notTargetMap]);
        expect(spot.findMap(targetId)).toBe(null);
    });

    it('検索対象マップが子マップに存在する場合にそのマップを返す', () => {
        const targetId = 0;
        const spot = new Spot(0, 'testMap', testCoord);
        // 検索したいスポット生成，登録
        const targetMap = new Map(targetId, 'targetMap', testBounds);
        spot.addDetailMaps([targetMap]);
        expect(spot.findMap(targetId)).toBe(targetMap);
    });

    it('検索対象マップが孫スポットに存在する場合にそのマップを返す', () => {
        // MapクラスのfindMapをモック
        const targetId = 999;
        const spot = new Spot(0, 'testMap', testCoord);
        const targetMap = new Map(999, 'targetMap', testBounds);
        const childMap = new Map(0, 'detailMap', testBounds);
        (spot as any).detailMaps = [childMap];
        // MapクラスのfindMapをモック
        childMap.findMap = jest.fn(() => {
            return targetMap;
        });
        expect(spot.findMap(targetId)).toBe(targetMap);
    });
});

describe('Spotクラス，findSpot', () => {
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('検索対象が見つからない場合nullを返す', () => {
        const targetId = 0;
        const spot = new Map(0, 'testMap', testBounds);
        expect(spot.findSpot(targetId)).toBe(null);
    });

    it('Spotの子マップの子孫に検索対象スポットが存在する場合', () => {
        const targetId = 999;
        const spot = new Spot(0, 'testMap', testCoord);
        // 検索対象マップ
        const childMap = new Map(0, 'childMap', testBounds);
        (spot as any).detailMaps = [childMap];
        // ルートマップの孫スポット
        const targetSpot = new Spot(targetId, 'targetSpot', testCoord);
        (childMap as any).spots = [targetSpot];
        // スポット側のfindMapをモックして検索対象マップを返すように
        targetSpot.findMap = jest.fn(() => {
            return childMap;
        });
        expect(spot.findSpot(targetId)).toBe(targetSpot);
    });
});
