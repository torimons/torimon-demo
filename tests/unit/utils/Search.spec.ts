import Search from '@/utils/Search';
import Spot from '@/Spot/Spot.ts';
import Map from '@/Map/Map.ts';

const rootMap: Map = new Map(0, 'rootMap', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined);
const spotsForTest: Spot[] = [
    new Spot(
        1,
        'SougouGakusyuPlaza',
        {
            lat: 33.595502,
            lng: 130.218238,
        },
        undefined,
        undefined,
        'this is a comment for test',
    ),
    new Spot(
        2,
        'SpotForTest',
        {
            lat: 33.595502,
            lng: 130.218238,
        },
        undefined,
        undefined,
    ),
];
// rootMap -> 総合学習プラザ
rootMap.addSpots([spotsForTest[0]]);
// 総合学習プラザ -> testMap
const testMap: Map = new Map(3, 'testMap', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined);
// testMap -> SpotForTest
spotsForTest[0].addDetailMaps([testMap]);
testMap.addSpots([spotsForTest[1]]);
// SpotForTest.getParentMap().getParentSpot()が総合学習プラザになるようにセット

describe('Searchクラスのテスト', () => {
    const targetSpotsForSearch = spotsForTest;
    const searchObj = new Search(targetSpotsForSearch);

    it('searchSpotsでスポットをキーワード検索', () => {
        // 'sougou'という文字を含んでいるスポットを検索(大文字小文字は区別しない)
        const keyword: string = 'sougou';
        const actualResult: Spot[] = searchObj.searchSpots(keyword);
        const expectedResult: Spot[] = spotsForTest;
        expect(actualResult).toStrictEqual(expectedResult);
    });

    it('検索ワードが空文字の場合，検索しない', () => {
        const keyword: string = '';
        const actualResult: Spot[] = searchObj.searchSpots(keyword);
        const expectedResult: Spot[] = [];
        expect(actualResult).toStrictEqual(expectedResult);
    });

    it('検索ワードがnullの場合，検索しない', () => {
        const keyword: null = null;
        const actualResult: Spot[] = searchObj.searchSpots(keyword);
        const expectedResult: Spot[] = [];
        expect(actualResult).toStrictEqual(expectedResult);
    });

    it('複数キーワードによるor検索', () => {
        const keywords: string = 'sougou test';
        const actualResult: Spot[] = searchObj.searchSpots(keywords);
        const expectedResult: Spot[] = spotsForTest;
        expect(actualResult).toStrictEqual(expectedResult);
    });

    it('parentSpotNameを対象とした検索', () => {
        const keyword: string = 'sougou';
        const actualResult: Spot[] = searchObj.searchSpots(keyword);
        // 親スポットの名前で検索すると,親スポット自身と,parentSpotNameを設定された
        // スポットが検索結果として返る.
        const expectedResult: Spot[] = spotsForTest;
        expect(actualResult).toStrictEqual(expectedResult);
    });

    it('descriptionを対象とした検索', () => {
        const keyword: string = 'comment';
        const actualResult: Spot[] = searchObj.searchSpots(keyword);
        const expectedResult: Spot[] = [spotsForTest[0]];
        expect(actualResult).toStrictEqual(expectedResult);
    });

});
