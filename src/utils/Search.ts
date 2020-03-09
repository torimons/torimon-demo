import { Spot } from '@/store/types';

export default class Search {

    private targetSpots: Spot[];

    constructor(spots: Spot[]) {
        this.targetSpots = spots;
    }

    /**
     * 検索ワードを受け取って，条件にあったスポットのリストを返す．
     * 複数の検索ワードを受け取った場合、一致した検索ワードが多い順に結果を返す。
     * 例として、検索ワードが「'hoge', 'fuga', 'piyo'」だった場合、
     * 1. 'hoge' and 'huga' and 'piyo'に一致したもの
     * 2. 'hoge' and 'huga'に一致したもの
     * 3. 'hoge'に一致したもの
     * を順番に返す。
     * @param keyword スポット検索ワード
     * @return keywordにかかったスポットのリスト
     */
    public searchSpots(keyword: string | null): Spot[] {
        // 空文字チェックは、検索ボックスをバックスペース等で空にしたときに
        // 空文字による検索が走るのを防ぐために必要。
        // nullチェックは、検索ボックスの x ボタンをクリックしたときに、
        // keywordがnullになり、その後の処理でエラーとなるため必要。
        if (keyword === '' || keyword === null) {
            return [];
        }
        const keywords: string[] = keyword.split(/\s+/).filter((word: string) => word !== '');
        let searchResults: Spot[] = [];
        for (let i = keywords.length; i > 0; i--) {
            const keywordsRegExp = this.compileIntoSearchCondition(keywords.slice(0, i));
            searchResults = searchResults.concat(
                this.targetSpots
                    .filter((s: Spot) => this.spotIsMatchToKeywords(s, keywordsRegExp)));
        }
        // 重複を削除したものを返す
        return searchResults.filter((x, i, self) => self.indexOf(x) === i);
    }

    /**
     * 検索単語の配列を受け取り，前処理した正規表現オブジェクトとして返す.
     * 検索条件はAnd.
     * @param keywords 検索条件の配列
     * @return 検索条件を表した正規表現オブジェクト
     */
    private compileIntoSearchCondition(keywords: string[]) {
        const joinAnd = (arr: string[]): string => {
            return '^(?=[\\s\\S]*' + arr.join(')(?=[\\s\\S]*') + ')';
        };
        const escape = (str: string): string => {
            return str.replace(/(?=[(){}\[\].*\\^$?])/g, '\\');
        };
        const rx: string = joinAnd(keywords.map(escape));
        return new RegExp(rx, 'i'); // iオプションで大文字小文字の区別をしない.
    }

    /**
     * スポットが正規表現にマッチするかどうかを判定する
     * @param spot filter対象のスポット
     * @param keywordsRegExp 検索キーワードの正規表現オブジェクト
     * @return isMatch スポットが検索ワードにマッチした場合true, マッチしなければfalse
     */
    private spotIsMatchToKeywords(spot: Spot, keywordsRegExp: RegExp): boolean {
        let target: string = spot.name;
        if (spot.parentSpotName !== undefined) {
            target = target + spot.parentSpotName;
        }
        if (spot.description !== undefined) {
            target += spot.description;
        }
        // RegExp.test(target:str)は、targetにRegExpがマッチした場合にtrue, マッチしない場合falseを返す.
        return keywordsRegExp.test(target);
    }
}
