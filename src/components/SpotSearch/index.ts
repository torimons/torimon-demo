import { Component, Vue, Watch } from 'vue-property-decorator';
import { Map, Spot } from '@/store/types';
import { mapViewGetters, mapViewMutations } from '@/store';
import Search from '@/utils/Search';

// こうなる予定？
// @Component({
    // components: {
    //     SearchBox,
    //     SpotList,
    // }
// })
@Component
export default class SpotSearch extends Vue {
    private searchWord: string = '';
    private spotListIsVisible: boolean = false;
    private targetSpots: Spot[] = [];
    private spotSearchResults: Spot[] = [];
    private search!: Search;

    public mounted() {
        // 全てのマップからスポットを取得，一つの配列に結合する
        mapViewGetters.maps
            .map((map: Map) => map.spots)
            .forEach((spots: Spot[]) => this.targetSpots = this.targetSpots.concat(spots));
        // 上で取得したspotを検索対象にセットしたSearchクラスのインスタンス作成
        this.search = new Search(this.targetSpots);
    }

    /**
     * SpotListの描画のオンオフを切り替える
     * @param isVisible セットする値(true/false)
     */
    public setSpotListIsVisible(isVisible: boolean) {
        this.spotListIsVisible = isVisible;
    }

    /**
     * 検索文字列をセットする．SearchBoxからemitで呼ばれる？
     * @param searchWord 検索文字列
     */
    public setSearchWord(searchWord: string) {
        this.searchWord = searchWord;
    }

    /**
     * searchWordの変更を検知して検索を行う
     */
    @Watch('searchWord')
    public searchSpot(): void {
        this.spotSearchResults = this.search.searchSpots(this.searchWord);
    }
}
