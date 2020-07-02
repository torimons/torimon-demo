import { Component, Watch, Vue, Emit } from 'vue-property-decorator';

@Component
export default class SearchBox extends Vue {
    private searchWord: string = '';
    private onFocus: boolean = false;

    /**
     * text-fieldをクリックした時にフォーカス状態にする
     */
    private focus(): void {
        this.onFocus = true;
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
    private exitSearch(): void {
        // SpotListを非表示するように伝える
        this.$emit('toggleList', false);
        this.onFocus = false;
        this.searchWord = '';
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
