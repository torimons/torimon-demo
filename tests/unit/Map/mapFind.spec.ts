import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

describe('Mapクラス，findSpot', () => {
    let map;
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('Mapに子スポットがないor見つからない場合にnullを返す', () => {
        const searchId = 0;
        // 子スポットがない場合
        map = new Map(0, 'testMap', testBounds);
        expect(map.findSpot(searchId)).toBe(null);

        // 子スポットはあるが，検索対象が見つからない場合
        const notTargetId = 999;
        const notTargetSpot = new Spot(notTargetId, 'notTargetSpot', testCoord);
        (map as any).spots = [notTargetSpot]; // 子供に追加
        expect(map.findSpot(searchId)).toBe(null);
    });

    it('検索対象スポットが子スポットに存在する場合にそのスポットを返す', () => {
        const targetId = 0;
        map = new Map(0, 'testMap', testBounds);
        // 検索したいスポット生成，登録
        const targetSpot = new Spot(targetId, 'targetSpot', testCoord);
        (map as any).spots = [targetSpot]; // 子供に追加
        expect(map.findSpot(targetId)).toBe(targetSpot);
    });

    it('検索対象スポットが子スポットの子孫に存在する場合にそのスポットを返す', () => {
        // ひ孫に検索対象がある
        const targetId = 999;
        map = new Map(0, 'testMap', testBounds);
        const childSpot = new Spot(1, 'childSpot', testCoord);
        const targetSpot = new Spot(targetId, 'targetSpot', testCoord);
        // 親子関係を追加
        (map as any).spots = [childSpot];
        // findSpotをモック
        childSpot.findSpot = jest.fn(() => {
            return targetSpot;
        });
        expect(map.findSpot(targetId)).toBe(targetSpot);
    });
});

describe('Mapクラス，findMap', () => {
    let map;
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('検索対象が見つからない場合nullを返す', () => {
        // 子スポットがない場合，null
        const searchId = 999;
        map = new Map(0, 'testMap', testBounds);
        expect(map.findMap(searchId)).toBe(null);

        // スポットは存在するが，見つからない場合
        map = new Map(0, 'testMap', testBounds);
        const childSpot = new Spot(0, 'childSpot', testCoord);
        (map as any).spots = [childSpot]; // 子供に追加
        // 見つからない
        childSpot.findMap = jest.fn(() => {
            return null;
        });
        expect(map.findMap(searchId)).toBe(null);
    });

    it('Mapの子スポットの子孫に検索対象マップが存在する場合', () => {
        const targetId = 999;
        // ルートマップ
        map = new Map(0, 'testMap', testBounds);
        // 検索対象マップ
        const targetMap = new Map(targetId, 'targetMap', testBounds);
        // ルートマップの子スポット
        const childSpot = new Spot(0, 'childSpot', testCoord);
        (map as any).spots = [childSpot]; // 子供に追加
        // スポット側のfindMapをモックして検索対象マップを返すように
        childSpot.findMap = jest.fn(() => {
            return targetMap;
        });
        expect(map.findMap(targetId)).toBe(targetMap);
    });
});
