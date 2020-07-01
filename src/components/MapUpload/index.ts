import { Component, Vue } from 'vue-property-decorator';
import { store, mapViewGetters, mapViewMutations } from '@/store';
import Map from '@/Map/Map.ts';
import MapView from '@/components/MapView/index.vue';

@Component({
    components: {
        MapView,
    },
})
export default class MapUpload extends Vue {
    private isValidInput: boolean = false;
    private loading: boolean = false;
    private mapName: string = '';
    private mapDescription: string = '';
    private mapNameRules = [
        (v: string) => !!v || 'マップの名前が必要です',
    ];
    private mapDescriptionRules = [
        (v: string) => !!v || 'マップの詳細が必要です',
    ];

    public mounted() {
        // 地図作成から戻ってきた時フォームに情報を入力しておく
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
     * 地図が作成されているかのboolを返す
     * @return 地図が作成されていればtrue, まだならfalse
     */
    public isMapCreated(): boolean {
        // おそらくrootMapがセットされているかで判定？
        const rootMap = mapViewGetters.rootMap;
        return rootMap !== undefined;
    }

    /**
     * アップロードボタンを押した時の処理
     * サーバーにデータをアップロードする
     */
    public upload() {
        // とりあえずボタンクリック時に3秒待つ処理を与えている
        this.loading = !this.loading;
        setTimeout(() => (this.loading = false), 3000);
    }
}
