import Spot from '@/Spot/Spot.ts';
import Map from '@/Map/Map.ts';

/**
 * isMatchToRegExp(RegExp)メソッドをもつ型(現状ではMap, Spotクラス)でのみSearchクラスを作成できる
 * そのオブジェクトが検索キーワードにマッチしているかはMap, Spotクラスに移行
 */
export default class Search<T extends { isMatchToRegExp(arg: RegExp): boolean }> {

    private targets: T[];

    constructor(targets: T[]) {
        this.targets = targets;
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
     * @return keywordにかかったオブジェクトのリスト
     */
    public search(keyword: string | null): T[] {
        // 空文字チェックは、検索ボックスをバックスペース等で空にしたときに
        // 空文字による検索が走るのを防ぐために必要。
        // nullチェックは、検索ボックスの x ボタンをクリックしたときに、
        // keywordがnullになり、その後の処理でエラーとなるため必要。
        if (keyword === '' || keyword === null) {
            return [];
        }
        const keywords: string[] = keyword.split(/\s+/).filter((word: string) => word !== '');
        let searchResults: T[] = [];
        for (let i = keywords.length; i > 0; i--) {
            const keywordsRegExp = this.compileIntoSearchCondition(keywords.slice(0, i));
            searchResults = searchResults.concat(
                this.targets
                    .filter((target: T) => target.isMatchToRegExp(keywordsRegExp)));
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
}
