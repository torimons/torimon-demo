import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

describe('Mapクラス，findDescendantSpot', () => {
    let map;
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const testCoord = { lat: 0, lng: 0 };

    it('子スポットがないor見つからない場合にnullを返す', () => {
        const searchId = 0;
        // 子スポットなしの時
        map = new Map(0, 'testMap', testBounds);
        expect(map.findDescendantSpot(searchId)).toBe(null);

        // 見つからない場合
        const notTargetId = 999;
        const notTargetSpot = new Spot(notTargetId, 'notTargetSpot', testCoord);
        map.addSpots([notTargetSpot]);
        expect(map.findDescendantSpot(searchId)).toBe(null);
    });

    it('検索対象スポットが子スポットに存在する場合にそのスポットを返す', () => {
        const targetId = 0;
        map = new Map(0, 'testMap', testBounds);
        // 検索したいスポット生成，登録
        const targetSpot = new Spot(targetId, 'targetSpot', testCoord);
        map.addSpots([targetSpot]);
        expect(map.findDescendantSpot(targetId)).toBe(targetSpot);
    });
});

describe('Mapクラス，findDescendantMap', () => {
    it.skip('placeholder', () => {
        // do nothing
    });
});
