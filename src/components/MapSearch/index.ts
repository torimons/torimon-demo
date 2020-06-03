import { Component, Vue, Watch } from 'vue-property-decorator';
import Map from '@/Map/Map.ts';
import { mapViewGetters, mapViewMutations } from '@/store';
import SearchBox from '@/components/SearchBox/index.vue';
import Search from '@/utils/Search';
import MapList from '@/components/MapList/index.vue';

@Component({
    components: {
        SearchBox,
        MapList,
    },
})
export default class MapSearch extends Vue {
    private searchWord: string = '';
    private mapListIsVisible: boolean = false;
    private targetMaps: Map[] = [];
    private mapSearchResults: Map[] = [];
    private search!: Search;
    private backgroundColor: 'transparent' | 'white' = 'transparent';

    public mounted() {
        // 全てのマップを取得，一つの配列に結合する
        // mapViewGetters.maps.map((map: Map) => this.targetMaps = this.targetMaps.concat(map));
        // 上で取得したmapを検索対象にセットしたSearchクラスのインスタンス作成もしくはSearchクラスの変更が必要
        // this.search = new Search(this.targetMaps);
    }

    /**
     * MapListの描画のオンオフを切り替える
     * @param isVisible セットする値(true/false)
     */
    public setMapListIsVisible(isVisible: boolean) {
        if (isVisible === true) {
            this.backgroundColor = 'white';
        } else {
            this.backgroundColor = 'transparent';
        }
        this.mapListIsVisible = isVisible;
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
    public searchMap(): void {
        // this.mapSearchResults = this.search.searchMaps(this.searchWord);
        if (this.mapSearchResults.length > 0) {
            this.setMapListIsVisible(true);
        } else {
            this.setMapListIsVisible(false);
        }
    }
}