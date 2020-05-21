import { Component, Vue, Watch } from 'vue-property-decorator';
import { RawMap } from '@/store/types';
import { mapViewGetters, mapViewMutations } from '@/store';
import SearchMap from '@/utils/SearchMap';
import SearchBox from '@/components/SearchBox/index.vue';
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
    private targetMaps: RawMap[] = [];
    private mapSearchResults: RawMap[] = [];
    private search!: SearchMap;
    private backgroundColor: 'transparent' | 'white' = 'transparent';

    public mounted() {
        // 全てのマップを取得，一つの配列に結合する
        mapViewGetters.maps.map((map: RawMap) => this.targetMaps = this.targetMaps.concat(map));
        // 上で取得したspotを検索対象にセットしたSearchクラスのインスタンス作成
        this.search = new SearchMap(this.targetMaps);
    }

    /**
     * SpotListの描画のオンオフを切り替える
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
        this.mapSearchResults = this.search.searchMaps(this.searchWord);
        if (this.mapSearchResults.length > 0) {
            this.setMapListIsVisible(true);
            // SpotInfoを非表示にする
            mapViewMutations.setSpotInfoIsVisible(false);
        } else {
            this.setMapListIsVisible(false);
            // focusedSpotが初期値ではない場合, SpotInfoを表示する
            // 直接focusedSpotを参照すると{mapId: [Getter/Setter], spotId: [Getter/Setter]}となり値が取得できないためIDごとに分離
            if (mapViewGetters.focusedSpot.mapId !== -1 && mapViewGetters.focusedSpot.spotId !== -1) {
                mapViewMutations.setSpotInfoIsVisible(true);
            }
        }
    }
}