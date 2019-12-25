import { Spot } from '@/store/types';

export default class Search {

    private targetSpotsForSearch: Spot[];

    constructor(spots: Spot[]) {
        this.targetSpotsForSearch = spots;
    }

    /**
     * 検索ワードを受け取って，条件にあったスポットのリストを返す．
     * @param keyword スポット検索ワード
     * @return 検索にかかったスポットのリスト
     */
    public getSearchResultOfSpots(keyword: string): Spot[] {
        const resultSpots: Spot[] = this.targetSpotsForSearch.filter((s: Spot) => {
            return s.name.match(keyword);
        });
        return resultSpots;
    }
}

