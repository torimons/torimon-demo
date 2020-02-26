import Search from '@/utils/Search';
import { Spot } from '@/store/types';

const spotsForTest: Spot[] = [
    {
        mapId: 0,
        id: 0,
        name: 'SougouGakusyuPlaza',
        coordinate: {
            lat: 33.595502,
            lng: 130.218238,
        },
        shape: {
            type: 'Polygon',
            coordinates: [[[]]],
        },
        description: 'this is a comment for test',
        gateNodeIds: [],
        detailMapIds: [1, 2],
        detailMapLevelNames: ['1F', '2F'],
        lastViewedDetailMapId: null,
    },
    {
        mapId: 0,
        id: 1,
        name: 'SpotForTest',
        coordinate: {
            lat: 33.595502,
            lng: 130.218238,
        },
        shape: {
            type: 'Polygon',
            coordinates: [[[]]],
        },
        parentSpotName: 'SougouGakusyuPlaza',
        gateNodeIds: [],
        detailMapIds: [],
        detailMapLevelNames: [],
        lastViewedDetailMapId: null,
    },
];

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
