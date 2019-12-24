import { Spot } from '@/store/types';

export default class Search {

    private searchTargetSpots: Spot[];

    constructor(spots: Spot[]) {
        this.searchTargetSpots = spots;
    }

    /**
     * 検索ワードを受け取って，条件にあったスポットのリストを返す．
     * @param keyword スポット検索ワード
     * @return 検索にかかったスポットのリスト
     */
    private getSearchResultOfSpots(keyword :string): Spot[] {
        const resultSpots: Spot[] = this.searchTargetSpots.filter((s: Spot) => {
            return s.name === keyword;
        })
        return resultSpots;
    }
}

