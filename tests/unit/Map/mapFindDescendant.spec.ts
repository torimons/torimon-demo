import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

describe('Mapクラス，findDescendantSpot', () => {
    let map;
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };

    it('子スポットがないor見つからない場合にnullを返す', () => {
        map = new Map(0, 'testMap', [], testBounds, undefined, undefined);
        expect(map.findDescendantSpot(0)).toBe(null);
    });

    it('子スポットに存在する場合にそのスポットを返す', () => {
        const targetId = 0;
        const targetSpot = new Spot(targetId, 'targetSpot', testBounds, )
    });
});

describe('Mapクラス，findDescendantMap', () => {
    it.skip('placeholder', () => {
        // do nothing
    });
});
