import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapViewGetters, mapViewMutations } from '@/store';
import Search from '@/utils/Search';
import SearchBox from '@/components/SearchBox/index.vue';
import SpotList from '@/components/SpotList/index.vue';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

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
    private search!: Search<Spot>;
    private backgroundColor: 'transparent' | 'white' = 'transparent';

    public mounted() {
        // 全てのマップからスポットを取得，一つの配列に結合する
        this.getAllSpots(mapViewGetters.rootMap);
        // 上で取得したspotを検索対象にセットしたSearchクラスのインスタンス作成
        this.search = new Search(this.targetSpots);
    }

    /**
     * SpotListの描画のオンオフを切り替える
     * @param isVisible セットする値(true/false)
     */
    public setSpotListIsVisible(isVisible: boolean) {
        if (isVisible === true) {
            this.backgroundColor = 'white';
        } else {
            this.backgroundColor = 'transparent';
        }
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
        this.spotSearchResults = this.search.search(this.searchWord);
        if (this.spotSearchResults.length > 0) {
            this.setSpotListIsVisible(true);
            // SpotInfoを非表示にする
            mapViewMutations.setSpotInfoIsVisible(false);
        } else {
            this.setSpotListIsVisible(false);
            // focusedSpotが初期値ではない場合, SpotInfoを表示する
            if (mapViewGetters.focusedSpot !== undefined) {
                mapViewMutations.setSpotInfoIsVisible(true);
            }
        }
    }

    /**
     * 全てのスポットを取得する
     * マップをみて，マップに属するスポットをtargetSpotsに追加，
     * さらにそのスポットに詳細マップがあれば再起的にこの関数を呼ぶ
     * @param スポットを取得したいルートマップ
     */
    private getAllSpots(rootMap: Map) {
        for (const spot of rootMap.getSpots()) {
            this.targetSpots.push(spot);
            for (const map of spot.getDetailMaps()) {
                this.getAllSpots(map);
            }
        }
    }
}
