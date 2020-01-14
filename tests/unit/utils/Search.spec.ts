import Search from '@/utils/Search';
import { SpotForSearch } from '@/store/types';

const spotsForTest: SpotForSearch[] = [
    {
        mapId: 0,
        spotId: 0,
        name: 'SougouGakusyuPlaza',
        coordinate: {
            lat: 33.595502,
            lng: 130.218238,
        },
    },
    {
        mapId: 0,
        spotId: 1,
        name: 'SpotForTest',
        coordinate: {
            lat: 33.595502,
            lng: 130.218238,
        },
    },
];

describe('Searchクラスのテスト', () => {

    it('searchSpotsでスポットをキーワード検索', () => {
        const targetSpotsForSearch = spotsForTest;
        const searchObj = new Search(targetSpotsForSearch);
        // 'sougou'という文字を名前に含んでいるスポットを検索(大文字小文字は区別しない)
        const keyword: string = 'sougou';
        const actualResult: SpotForSearch[] = searchObj.searchSpots(keyword);
        const expectedResult: SpotForSearch[] = [spotsForTest[0]];
        expect(actualResult).toStrictEqual(expectedResult);
    });

});
