import SearchMap from '@/utils/SearchMap';
import { RawMap } from '@/store/types';

const mapsForTest: RawMap[] = [
    {
        id: 0,
        name: 'testForMap0',
        floorName: 'testFloor0',
        spots: [],
        nodes: [],
        edges: [],
        bounds: {
            topL: {
                lat: 0,
                lng: 0,
            },
            botR: {
                lat: 0,
                lng: 0,
            },
        },
        parentSpotId: 0,
    },
    {
        id: 1,
        name: 'testForMap1',
        floorName: 'testFloor1',
        spots: [],
        nodes: [],
        edges: [],
        bounds: {
            topL: {
                lat: 1,
                lng: 1,
            },
            botR: {
                lat: 1,
                lng: 1,
            },
        },
        parentSpotId: 1,
    },
];

describe('SearchMapクラスのテスト', () => {
    const targetMapsForSearch = mapsForTest;
    const searchMapObj = new SearchMap(targetMapsForSearch);

    it('searchMapsでマップをキーワード検索', () => {
        // 'test'という文字を含んでいるマップを検索(大文字小文字は区別しない)
        const keyword: string = 'test';
        const actualResult: RawMap[] = searchMapObj.searchMaps(keyword);
        const expectedResult: RawMap[] = mapsForTest;
        expect(actualResult).toStrictEqual(expectedResult);
    });

    it('検索ワードが空文字の場合，検索しない', () => {
        const keyword: string = '';
        const actualResult: RawMap[] = searchMapObj.searchMaps(keyword);
        const expectedResult: RawMap[] = [];
        expect(actualResult).toStrictEqual(expectedResult);
    });

    it('検索ワードがnullの場合，検索しない', () => {
        const keyword: null = null;
        const actualResult: RawMap[] = searchMapObj.searchMaps(keyword);
        const expectedResult: RawMap[] = [];
        expect(actualResult).toStrictEqual(expectedResult)
    });

    it('複数キーワードによるマップのor検索', () => {
        const keywords: string = 'floor map';
        const actualResult: RawMap[] = searchMapObj.searchMaps(keywords);
        const expectedResult: RawMap[] = mapsForTest;
        expect(actualResult).toStrictEqual(expectedResult);
    });
});