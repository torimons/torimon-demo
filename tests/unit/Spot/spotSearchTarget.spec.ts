import Spot from '@/Spot/Spot.ts';
import Map from '@/Map/Map.ts';

describe('Spotの検索対象文字列のテスト', () => {
    const rootMap: Map = new Map(0, 'rootMap', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined);
    const sougou = new Spot(
            1,
            'SougouGakusyuPlaza',
            {
                lat: 33.595502,
                lng: 130.218238,
            },
            undefined,
            undefined,
            'this is a comment for description test',
        );
    const testSpot = new Spot(2, 'testSpot', {lat: 0, lng: 0});
    // rootMap -> 総合学習プラザ -> testMap -> testSpot
    rootMap.addSpots([sougou]);
    const testMap: Map = new Map(3, 'testMap', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined);
    sougou.addDetailMaps([testMap]);
    testMap.addSpots([testSpot]);
    // testSpot.getParentMap().getParentSpot()が総合学習プラザになるようにセット

    it('親マップあり，親スポットなしのスポットの検索対象文字列は自身の名前とdescriptionになる', () => {
        // sougouは親マップ(rootMap)があり，rootMapには親スポットがない
        // => 自身の名前+descriptionになる
        const expectedString = sougou.getName() + sougou.getDescription();
        expect((sougou as any).generateSearchTargetString()).toBe(expectedString);
    });

    it('親マップあり，親スポットあり，descriptionなしのスポットの検索対象文字列は自身の名前と親スポットの名前になる', () => {
        // testSpotは親マップ(testMap)，親スポット(sougou)があり，desctiptionはない．
        // => 自身の名前+parentSpotの名前になる
        const expectedString = testSpot.getName() + sougou.getName();
        expect((testSpot as any).generateSearchTargetString()).toBe(expectedString);
    });
});
