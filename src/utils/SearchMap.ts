import { RawMap } from '@/store/types';

export default class SearchMap {
    private targetMaps: RawMap[];

    constructor(targetMap: RawMap[]) {
        this.targetMaps = targetMap;
    }

    /**
     * 検索ワードを受け取って，条件にあったマップのリストを返す．
     * 複数の検索ワードを受け取った場合、一致した検索ワードが多い順に結果を返す。
     * 例として、検索ワードが「'hoge', 'fuga', 'piyo'」だった場合、
     * 1. 'hoge' and 'huga' and 'piyo'に一致したもの
     * 2. 'hoge' and 'huga'に一致したもの
     * 3. 'hoge'に一致したもの
     * を順番に返す。
     * @param keyword マップ検索ワード
     * @return keywordにかかったマップのリスト
     */
    public searchMaps(keyword: string | null): RawMap[] {
        // 空文字チェックは、検索ボックスをバックスペース等で空にしたときに
        // 空文字による検索が走るのを防ぐために必要。
        // nullチェックは、検索ボックスの x ボタンをクリックしたときに、
        // keywordがnullになり、その後の処理でエラーとなるため必要。
        if (keyword === '' || keyword === null) {
            return [];
        }
        const keywords: string[] = keyword.split(/\s+/).filter((word: string) => word !== '');
        let searchMapResults: RawMap[] = [];
        for (let i = keywords.length; i > 0; i--) {
            const keywordsRegExp = this.compileIntoSearchCondition(keywords.slice(0, i));
            searchMapResults = searchMapResults.concat(
                this.targetMaps
                    .filter((m: RawMap) => this.mapIsMatchToKeywords(m, keywordsRegExp)));
        }
        // 重複を削除したものを返す
        return searchMapResults.filter((x, i, self) => self.indexOf(x) === i);
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
     * マップが正規表現にマッチするかどうかを判定する
     * @param map filter対象のマップ
     * @param keywordsRegExp 検索キーワードの正規表現オブジェクト
     * @return isMatch マップが検索ワードにマッチした場合true, マッチしなければfalse
     */
    private mapIsMatchToKeywords(map: RawMap, keywordsRegExp: RegExp): boolean {
        let targetMap: string = map.name;
        if (map.floorName !== undefined) {
            targetMap += map.floorName;
        }
        // RegExp.test(target:str)は、targetにRegExpがマッチした場合にtrue, マッチしない場合falseを返す.
        return keywordsRegExp.test(targetMap);
    }
}