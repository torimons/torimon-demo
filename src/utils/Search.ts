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
        // 空文字チェックは、検索ボックスをバックスペース等で空にしたときに
        // 空文字による検索が走るのを防ぐために必要。
        // nullチェックは、検索ボックスの x ボタンをクリックしたときに、
        // keywordがnullになり、その後の処理でエラーとなるため必要。
        if (keyword === '' || keyword === null) {
            return [];
        }
        const keywords: string[][] = keyword.split(/\s+/)
            .filter((word: string) => word !== '')
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
            return str.replace(/(?=[(){}\[\].*\\^$?])/g, '\\');
        };
        const rx: string = joinOr(cond.map((inner: string[]): string => {
            return joinAnd(inner.map(escape));
        }));
        return new RegExp(rx, 'i'); // iオプションで大文字小文字の区別をしない.
    }

    /**
     * スポットが正規表現にマッチするかどうかを判定する
     * @param spot filter対象のスポット
     * @param keywordsRegExp 検索キーワードの正規表現オブジェクト
     * @return isMatch スポットが検索ワードにマッチした場合true, マッチしなければfalse
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
