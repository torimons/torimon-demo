import { Component, Emit, Vue, Prop } from 'vue-property-decorator';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog/index.vue';
import Map from '@/Map/Map';

@Component({
    components: {
        DeleteConfirmationDialog,
    },
})
export default class TreeView extends Vue {
    @Prop()
    private items: any;
    private tree = [];
    private dialog: boolean = false;
    private selectedMapId!: number;
    private selectedMapName: string = '';

    @Emit('setMapToEdit')
    private sendMapToEdit(id: number) {
        return id;
    }

    @Emit('setSpotToEdit')
    private sendSpotToEdit(id: number) {
        return id;
    }

    private getSpotIconName(spotItem: any) {
        return spotItem.iconName;
    }

    /**
     * 削除ボタンを押すと呼び出され、削除確認ダイアログを表示する。
     * @param mapItem 削除対象の詳細マップ
     */
    private confirmMapDeletion(mapItem: any) {
        this.dialog = true;
        this.selectedMapId = mapItem.id;
        this.selectedMapName = mapItem.name;
    }

    /**
     * DeleteConfirmationDialogで削除ボタンが押されると呼び出され、
     * 指定された詳細マップを削除するイベントを発火する。
     */
    @Emit('del')
    private deleteMap() {
        this.dialog = false;
        return this.selectedMapId;
    }

    @Emit('dup')
    private sendMapToDuplicate(mapId: number) {
        return mapId;
    }

    /**
     * DeleteConfirmationDialogでCancelボタンが押されると呼び出され、
     * 削除確認ダイアログを閉じる。
     */
    private cancelMapDeletion() {
        this.dialog = false;
    }
}
