import { Component, Watch, Vue, Emit } from 'vue-property-decorator';
import { mdiAccount } from '@mdi/js';

@Component
export default class SearchBox extends Vue {
    private searchWord: string = '';
    private onFocus: boolean = false;

    /**
     * text-fieldをクリックした時にフォーカス状態にする
     */
    private focus(): void {
        this.onFocus = true;
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
}
