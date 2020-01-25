import { Spot } from '@/store/types';

export default class Search {

    private targetSpots: Spot[];

    constructor(spots: Spot[]) {
        this.targetSpots = spots;
    }

    /**
     * 検索ワードを受け取って，条件にあったスポットのリストを返す．
     * @param keyword スポット検索ワード
     * @return keywordにかかったスポットのリスト
     */
    public searchSpots(keyword: string): Spot[] {
        if (keyword === '' || keyword === null) {
            return [];
        }
        console.log(keyword);
        const keywords: string[][] = keyword.split(/\s+/)
            .filter((word: string) => word !== '' && word !== '\\\\')
            .map((word: string) => [word]);
        const keywordsRegExp = this.compileIntoSearchCondition(keywords);
        return this.targetSpots.filter((s: Spot) => this.spotIsMatchToKeywords(s, keywordsRegExp));
    }

    /**
     * 検索単語の配列を受け取り，前処理した正規表現オブジェクトとして返す.
     * [
     *  ['a', 'b', 'c'],
     *  ['d'],
     *  ['e', 'f'],
     * ]
     * のとき，検索条件は ('a' and 'b' and 'c') or ('d') or ('e' and 'f')
     * @param cond 検索条件の配列
     * @return 検索条件を表した正規表現オブジェクト
     */
    private compileIntoSearchCondition(cond: string[][]) {
        const joinAnd = (arr: string[]): string => {
            return '^(?=[\\s\\S]*' + arr.join(')(?=[\\s\\S]*') + ')';
        };
        const joinOr = (arr: string[]): string => {
            return '(?:' + arr.join('|') + ')';
        };
        const escape = (str: string): string => {
            return str.replace(/(?=[(){}\[\].*\\^$?])/, '\\');
        };
        const rx = joinOr(cond.map((inner: string[]): string => {
            return joinAnd(inner.map(escape));
        }));
        const regExp: string = rx.replace(/=\[\\s\\S\]\*-/g, '![\\s\\S]*');
        return new RegExp(regExp, 'i');
    }

    /**
     * スポットが正規表現にマッチするかどうかを判定する
     * @param spot filter対象のスポット
     * @param keywordsRegExp 検索キーワードの正規表現オブジェクト
     * @return isMatch スポットが正規表現にマッチした場合true, マッチしなければfalse
     */
    private spotIsMatchToKeywords(spot: Spot, keywordsRegExp: RegExp): boolean {
        let isMatch: boolean = false;
        isMatch = isMatch || spot.name.match(keywordsRegExp) !== null;
        if (spot.parentSpotName !== undefined) {
            isMatch = isMatch || (spot.parentSpotName.match(keywordsRegExp) !== null);
        }
        if (spot.description !== undefined) {
            isMatch = isMatch || (spot.description.match(keywordsRegExp) !== null);
        }
        return isMatch;
    }
}
