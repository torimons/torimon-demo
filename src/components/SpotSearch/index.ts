import { Component, Vue, Watch } from 'vue-property-decorator';
import { Map, Spot } from '@/store/types';
import { mapViewGetters, mapViewMutations } from '@/store';
import Search from '@/utils/Search';
import SearchBox from '@/components/SearchBox/index.vue';
import SpotList from '@/components/SpotList/index.vue';

@Component({
    components: {
        SearchBox,
        SpotList,
    },
})
export default class SpotSearch extends Vue {
    private searchWord: string = '';
    private spotListIsVisible: boolean = false;
    private targetSpots: Spot[] = [];
    private spotSearchResults: Spot[] = [];
    private search!: Search;
    private backgroundColor: 'transparent' | 'white' = 'transparent';

    public mounted() {
        // 全てのマップからスポットを取得，一つの配列に結合する
        mapViewGetters.maps.map((map: Map) => map.spots)
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
        if (this.spotSearchResults.length > 0) {
            this.setSpotListIsVisible(true);
            // SpotInfoを非表示にする
            mapViewMutations.setSpotInfoIsVisible(false);
            this.backgroundColor = 'white';
        } else {
            this.setSpotListIsVisible(false);
            // focusedSpotが初期値ではない場合, SpotInfoを表示する
            // 直接focusedSpotを参照すると{mapId: [Getter/Setter], spotId: [Getter/Setter]}となり値が取得できないためIDごとに分離
            if (mapViewGetters.focusedSpot.mapId !== -1 && mapViewGetters.focusedSpot.spotId !== -1) {
                mapViewMutations.setSpotInfoIsVisible(true);
            }
            this.backgroundColor = 'transparent';
        }
    }
}
