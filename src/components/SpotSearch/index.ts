import { Component, Vue, Watch } from 'vue-property-decorator';
import { Map, Spot, SpotForSearch } from '@/store/types';
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
    private targetSpots: SpotForSearch[] = [];
    private spotSearchResults: SpotForSearch[] = [];
    private search!: Search;

    public mounted() {
        // 全てのマップからスポットを取得，一つの配列に結合する
        mapViewGetters.maps.forEach((map: Map) => {
            const spotsForSearch: SpotForSearch[] = map.spots.map((spot: Spot) => {
                return {
                    mapId: map.id,
                    spotId: spot.id,
                    name: spot.name,
                    coordinate: spot.coordinate,
                };
            });
            this.targetSpots = this.targetSpots.concat(spotsForSearch);
        });
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
