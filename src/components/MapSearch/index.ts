import { Component, Vue, Watch } from 'vue-property-decorator';
import Map from '@/Map/Map.ts';
import { mapViewGetters, mapViewMutations } from '@/store';
import SearchBox from '@/components/SearchBox/index.vue';
import Search from '@/utils/Search';
import MapList from '@/components/MapList/index.vue';
import MapDetailCard from '@/components/MapDetailCard/index.vue';

const mockMaps: Map[] = [
    new Map(0, 'mock0', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined, 'desctiption of mock 0'),
    new Map(1, 'mock1', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined, 'desctiption of mock 1'),
    new Map(2, 'mock2', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined, 'desctiption of mock 2'),
    new Map(3, 'mock3', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined, 'desctiption of mock 3'),
    new Map(4, 'mock4', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined, 'desctiption of mock 4'),
    new Map(5, 'mock5', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined, 'desctiption of mock 5'),
];

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
    private mapSearchResults: Map[] = mockMaps;
    private search!: Search<Map>;
    private backgroundColor: 'transparent' | 'white' = 'transparent';

    public mounted() {
        // マップのテストデータが出来次第searchクラスのインスタンスに渡す
        // this.search = new Search(this.targetMaps);
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
        this.mapListIsVisible = true;
        // SearchクラスがMapに対応するまでは使用不可.
        // this.mapSearchResults = this.search.searchMaps(this.searchWord);
    }
}
