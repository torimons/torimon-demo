import { Spot, SpotForSearch } from '@/store/types';

export default class Search {

    private targetSpots: SpotForSearch[];

    constructor(spots: SpotForSearch[]) {
        this.targetSpots = spots;
    }

    /**
     * 検索ワードを受け取って，条件にあったスポットのリストを返す．
     * @param keyword スポット検索ワード
     * @return keywordにかかったスポットのリスト
     */
    public searchSpots(keyword: string): SpotForSearch[] {
        const searchExp = new RegExp(keyword, 'i'); // 'i'オプションで大文字小文字を区別しない
        return this.targetSpots.filter((s: SpotForSearch) => {
            return s.name.match(searchExp);
        });
    }
}

