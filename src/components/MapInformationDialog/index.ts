import { Component, Vue, Emit } from 'vue-property-decorator';
import { store, mapViewGetters, mapViewMutations } from '@/store';
import Map from '@/Map/Map.ts';
import { MapViewGetters } from '@/store/modules/MapViewModule/MapViewGetters';
import axios from 'axios';
import MapDataConverter from '@/utils/MapDataConverter';
import API from '@/utils/API';

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
    private api: API = new API();

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
        return mapViewGetters.isMapCreated;
    }

    /**
     * アップロードボタンを押した時の処理
     * サーバーにデータをアップロードする
     */
    private async upload() {
        // 今後作成予定のアップロード関数を使う
        this.loading = true;
        // アップロードするマップの準備
        const mapToUpload: Map = mapViewGetters.rootMap;
        mapToUpload.setName(this.mapName);
        mapToUpload.setDescription(this.mapDescription);
        await this.api.postMap(mapToUpload);
        this.loading = false;
        // map-selectに遷移
        this.$router.push('/');
    }

    private startNewMap() {
        mapViewMutations.setIsMapCreated(true);
    }
}
