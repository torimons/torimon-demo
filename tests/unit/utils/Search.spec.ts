import Search from '@/utils/Search';
import Spot from '@/Spot/Spot.ts';
import Map from '@/Map/Map.ts';

/**
 * Searchクラスで扱うisMatchToRegExpをもつクラス
 */
class SearchTarget {
    private targetString: string;

    // ここでわたすtargetStringがそのまま検索対象になる
    constructor(targetString: string) {
        this.targetString = targetString;
    }

    public isMatchToRegExp(regExp: RegExp): boolean {
        return regExp.test(this.targetString);
    }
}

describe('Searchクラスのテスト', () => {
    const targetsForTest: SearchTarget[] = [
        new SearchTarget('sougou'),
        new SearchTarget('sougou hoge'),
        new SearchTarget('sougou hoge fuga'),
    ];
    const searchObj = new Search<SearchTarget>(targetsForTest);

    it('検索ワードが空文字の場合，検索しない', () => {
        const keyword: string = '';
        const actualResult: SearchTarget[] = searchObj.search(keyword);
        const expectedResult: SearchTarget[] = [];
        expect(actualResult).toStrictEqual(expectedResult);
    });

    it('検索ワードがnullの場合，検索しない', () => {
        const keyword: null = null;
        const actualResult: SearchTarget[] = searchObj.search(keyword);
        const expectedResult: SearchTarget[] = [];
        expect(actualResult).toStrictEqual(expectedResult);
    });

    it('複数キーワードによるand検索', () => {
        const keywords: string = 'sougou hoge fuga';
        /**
         * sougou hoge fuga
         * sougou hoge
         * sougou
         * の順に整列しているか確認する
         */
        const actualResult: SearchTarget[] = searchObj.search(keywords);
        const expectedResult: SearchTarget[] = targetsForTest.reverse();
        expect(actualResult).toStrictEqual(expectedResult);
    });
});
