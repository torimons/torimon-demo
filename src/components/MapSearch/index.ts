import { Component, Vue, Watch } from 'vue-property-decorator';
import Map from '@/Map/Map.ts';
import { mapViewGetters } from '@/store';
import SearchBox from '@/components/SearchBox/index.vue';
import Search from '@/utils/Search';
import MapList from '@/components/MapList/index.vue';
import MapDataConverter from '@/utils/MapDataConverter';
import axios from 'axios';

// 地図データが用意されるまで、モックデータを検索結果として利用
const mockMaps: Map[] = [
    new Map(1001, 'mock1', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined, 'desctiption of mock 1'),
    new Map(1002, 'mock2', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined, 'desctiption of mock 2'),
    new Map(1003, 'mock3', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined, 'desctiption of mock 3'),
    new Map(1004, 'mock4', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined, 'desctiption of mock 4'),
    new Map(1005, 'mock5', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, undefined, 'desctiption of mock 5'),
];

@Component({
    components: {
        SearchBox,
        MapList,
    },
})
export default class MapSearch extends Vue {
    private searchWord: string = '';
    private getDataSucceeded: boolean = true;
    private targetMaps: Map[] = [];
    private mapSearchResults: Map[] = [];
    private search!: Search<Map>;
    private backgroundColor: 'transparent' | 'white' = 'transparent';

    public async mounted() {
        // APIからマップデータを取得してセットする
        // TODO: ~~ベタ書きからtypes?かどこかに移動?~~
        // アップロードのタスクでアップロード・ダウンロードをutil/以下に移動予定
        const mapURL: string = 'http://localhost:3000/maps';
        try {
            const res = await axios.get(mapURL);
            // searchクラスに与えるMapを準備
            res.data.map((jsonMap: any) => {
                this.targetMaps.push(MapDataConverter.json2tree(jsonMap));
            });
        } catch (err) {
            this.getDataSucceeded = false;
        }
        // 表示が寂しいのでとりあえずmockデータもtargetMapsに追加
        this.targetMaps = this.targetMaps.concat(mockMaps);
        this.search = new Search<Map>(this.targetMaps);
        // 最初は全結果を表示
        this.mapSearchResults = this.targetMaps;
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
        // 検索がないときは全データ表示する
        if (this.searchWord.length === 0) {
            this.mapSearchResults = this.targetMaps;
        } else {
            this.mapSearchResults = this.search.search(this.searchWord);
        }
    }
}
