import { Component, Vue, Watch } from 'vue-property-decorator';
import { Spot, SpotForMap } from '@/store/types';
import { mapViewStore } from '@/store/modules/MapViewModule';

// こうなる予定？
// @Component({
    // components: {
    //     SearchBox,
    //     SpotList,
    // }
// })
@Component
export default class SpotSearch extends Vue {
    private searchWord!: string;
    private spotListIsVisible: boolean = false;
    private targetSpot: Spot[] = [];
    private spotSearchResults: Spot[] = [];

    public mounted() {
        // 全てのマップからスポットを取得し，検索対象に追加する
        // this.targetSpot.push()
    }

    /**
     * SpotListの描画のオンオフを切り替える
     * @param isVisible セットする値(true/false)
     */
    public setSpotListIsVisible(isVisible: boolean) {
        // set
    }

    /**
     * 検索文字列をセットする
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
        // searchクラスの検索を呼び出す
    }
}
