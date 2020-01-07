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
        this.openSpotList();
    }

    /**
     * text-field以外をクリックした時にフォーカス状態を解除する
     */
    private focusCancel(): void {
        this.onFocus = false;
    }

    /**
     * 戻るボタンをクリックした時にspotSearchコンポーネントに
     * spotListを閉じるように伝える
     */
    private exitSpotSearch(): void {
        this.closeSpotList();
        this.onFocus = false;
    }

    /**
     * spotListを表示するよう伝える
     * @Emit 'toggleSpotList' true
     */
    @Emit('toggleSpotList')
    private openSpotList(): boolean {
        return true;
    }

    /**
     * spotListを非表示にするよう伝える
     * @Emit 'toggleSpotList' false
     */
    @Emit('toggleSpotList')
    private closeSpotList(): boolean {
        return false;
    }
}
