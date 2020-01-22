import { Component, Watch, Vue, Emit } from 'vue-property-decorator';
import { mapViewMutations } from '@/store';

@Component
export default class SearchBox extends Vue {
    private searchWord: string = '';
    private onFocus: boolean = false;

    /**
     * text-fieldをクリックした時にフォーカス状態にする
     */
    private focus(): void {
        this.onFocus = true;
        mapViewMutations.setFocusedSpot({mapId: -1, spotId: -1});
        // SpotInfoを非表示にする
        mapViewMutations.setSpotInfoIsVisible(false);
        // SpotListを表示するように伝える
        this.$emit('toggleSpotList', true);
    }

    /**
     * text-field以外をクリックした時にonFocusをfalseにする
     */
    private unfocus(): void {
        this.onFocus = false;
    }

    /**
     * 戻るボタンをクリックした時にspotSearchコンポーネントに
     * spotListを閉じるように伝える
     */
    private exitSpotSearch(): void {
        // SpotListを非表示するように伝える
        this.$emit('toggleSpotList', false);
        this.onFocus = false;
        // text-fieldからフォーカスを外す
        (this.$refs.searchTextField as HTMLInputElement).blur();
    }

    @Emit('searchWordInput')
    private sendSearchWord(): string {
        return this.searchWord;
    }

    @Watch('searchWord')
    private onChangeSearchWord(): void {
        this.sendSearchWord();
    }
}
