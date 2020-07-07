import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog/index.vue';
import Map from '@/Map/Map';

@Component({
    components: {
        DeleteConfirmationDialog,
    },
})
export default class DetailMapManageList extends Vue {
    @Prop() public detailMaps!: Map[];
    public dialog: boolean = false;
    public selectedMap: Map | null = null;
    public selectedMapName: string = '';

    private hasDetailMaps: boolean = false;

    /**
     * 編集ボタンが押されると呼び出され、
     * 選択した詳細マップを編集するイベントを発火する。
     */
    private editDetailMap(detailMap: Map): void {
        this.$emit('edit', detailMap);
    }

    /**
     * 複製ボタンが押されると呼び出され、
     * 指定した詳細マップを複製するイベントを発火する。
     * @param detailMap 複製対象の詳細マップ
     */
    private duplicateMap(detailMap: Map) {
        this.$emit('dup', detailMap);
    }

    /**
     * 削除ボタンを押すと呼び出され、削除確認ダイアログを表示する。
     * @param detailMap 削除対象の詳細マップ
     */
    private confirmMapDeletion(detailMap: Map): void {
        this.dialog = true;
        this.selectedMap = detailMap;
        this.selectedMapName = detailMap.getName();
    }

    /**
     * DeleteConfirmationDialogで削除ボタンが押されると呼び出され、
     * 指定された詳細マップを削除するイベントを発火する。
     */
    private deleteMap() {
        this.dialog = false;
        this.$emit('del', this.selectedMap!.getId());
    }

    /**
     * DeleteConfirmationDialogでCancelボタンが押されると呼び出され、
     * 削除確認ダイアログを閉じる。
     */
    private cancelMapDeletion() {
        this.dialog = false;
    }

    /**
     * 追加された詳細マップが1つ以上ある場合は
     * 詳細マップリストを表示する
     */
    @Watch('detailMaps')
    private updateHasDetailMaps(): void {
        this.hasDetailMaps = this.detailMaps.length > 0;
    }

}
