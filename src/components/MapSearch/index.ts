import { Component, Vue, Watch } from 'vue-property-decorator';
import Map from '@/Map/Map.ts';
import { mapViewGetters, mapViewMutations } from '@/store';
import SearchBox from '@/components/SearchBox/index.vue';
import Search from '@/utils/Search';
import MapList from '@/components/MapList/index.vue';
import axios from 'axios';

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
    private search!: Search<Map>;
    private backgroundColor: 'transparent' | 'white' = 'transparent';

    public async mounted() {
        // APIからマップデータを取得してセットする
        // TODO: ベタ書きからtypes?かどこかに移動
        const mapURL: string = 'http://localhost:3000/maps';
        const res = await axios.get(mapURL);
        // TODO: jsonを木構造に変換してtargetMapsにセットする
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
    }
}
