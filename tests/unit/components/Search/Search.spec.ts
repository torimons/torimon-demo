import Search from '@/components/Search/Search.ts';
import { Spot } from '@/store/types';

const spotsForTest: Spot[] = [
    {
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
        gateNodeIds: [],
        detailMapIds: [1, 2],
        detailMapLevelNames: ['1F', '2F'],
        lastViewedDetailMapId: null,
    },
    {
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
        gateNodeIds: [],
        detailMapIds: [],
        detailMapLevelNames: [],
        lastViewedDetailMapId: null,
    },
];

describe('Searchクラスのテスト', () => {

    it('getSearchResultOfSpotsでスポットの配列からキーワード検索', () => {
        const targetSpotsForSearch = spotsForTest;
        const searchObj = new Search(targetSpotsForSearch);
        // 'Sougou'という文字を名前に含んでいるスポットを検索
        const keyword: string = 'Sougou';
        const actualResult: Spot[] = searchObj.getSearchResultOfSpots(keyword);
        const expectedResult: Spot[] = [spotsForTest[0]];
        expect(actualResult).toStrictEqual(expectedResult);
    });

});
