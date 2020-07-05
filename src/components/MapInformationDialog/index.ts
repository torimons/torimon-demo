import { Component, Vue, Emit } from 'vue-property-decorator';
import { store, mapViewGetters } from '@/store';
import Map from '@/Map/Map.ts';

@Component
export default class MapInformationDialog extends Vue {
    private isValidInput: boolean = false;
    private loading: boolean = false;
    private mapName: string = '';
    private mapDescription: string = '';
    private dialog: boolean = false;
    private mapNameRules = [
        (v: string) => !!v || '地図の名前が必要です',
    ];
    private mapDescriptionRules = [
        (v: string) => !!v || '地図の説明が必要です',
    ];

    public mounted() {
        // 地図作成から開いた時，フォームに情報を入力しておく
        if (this.isMapCreated()) {
            const rootMap: Map = mapViewGetters.rootMap;
            this.mapName = rootMap.getName();
            const description = rootMap.getDescription();
            if (description !== undefined) {
                this.mapDescription = description;
            } else {
                this.mapDescription = '';
            }
        }
    }

    /**
     * 親コンポーネントにdialogを閉じるイベントを送出する
     */
    @Emit('closeDialog')
    private closeDialog() {
        // 現状特に実装なし
        // 地図作成中の場合rootMapの情報を更新するなど？
    }

    /**
     * 地図が作成されているかのboolを返す
     * @return 地図が作成されていればtrue, まだならfalse
     */
    private isMapCreated(): boolean {
        // おそらくrootMapがセットされているかで判定？
        // 他のコンポーネントとの結合時に修正
        // const rootMap = mapViewGetters.rootMap;
        // return rootMap !== undefined;
        return false;
    }

    /**
     * アップロードボタンを押した時の処理
     * サーバーにデータをアップロードする
     */
    private upload() {
        // 今後作成予定のアップロード関数を使う
        // とりあえずボタンクリック時に3秒待つ処理を与えている
        this.loading = !this.loading;
        setTimeout(() => (this.loading = false), 3000);
    }
}
