import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class MapUpload extends Vue {
    private isValidInput: boolean = false;
    private loading: boolean = false;
    private mapName: string = '';
    private detailOfMap: string = '';
    private mapNameRules = [
        (v: string) => !!v || 'マップの名前が必要です',
    ];
    private detailOfMapRules = [
        (v: string) => !!v || 'マップの詳細が必要です',
    ];

    /**
     * Uploadボタンを押した時の処理
     * サーバーにデータをアップロードする
     */
    public onClickUpload() {
        // submit to server
        // とりあえずボタンクリック時に3秒待つ処理を与えている
        this.loading = !this.loading;
        setTimeout(() => (this.loading = false), 3000);
    }

    /**
     * Cancelボタンを押した時マップ作成画面に戻る？
     */
    public onCancel() {
        // 戻る処理？
    }
}
