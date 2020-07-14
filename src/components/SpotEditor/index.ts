import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DetailMapManageList from '@/components/DetailMapManageList/index.vue';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog/index.vue';
import Map from '@/Map/Map';
import Spot from '@/Spot/Spot';

@Component({
    components: {
        DetailMapManageList,
        DeleteConfirmationDialog,
    },
})
export default class SpotEditor extends Vue {
    @Prop()
    public spot!: Spot;
    @Prop()
    public isVisible!: boolean;
    @Prop()
    public whileShapeEditing!: boolean;
    @Prop()
    public whileShapeEditingForDetailMapAdding!: boolean;
    private shapeAddIconIsVisible = true;
    private detailMapAddButtonName: '詳細マップ' | 'キャンセル' = '詳細マップ';
    private shapeAddButtonName: '範囲選択' | 'キャンセル' = '範囲選択';
    private attachment: [{name: string, url: string}] = [{name: '', url: ''}];
    private dialog: boolean = false;

    mounted() {
        this.$watch(
            () => [this.whileShapeEditing, this.whileShapeEditingForDetailMapAdding],
            this.switchShapeAddButtonName,
        )
    }

    /**
     * DetailMapManageListから詳細マップ追加のイベントが発火されると呼び出され、
     * 詳細マップ追加のイベントを発火する。
     */
    private onClickDetailMapAddButton(): void {
        if (this.whileShapeEditingForDetailMapAdding) {
            this.$emit('clickDetailMapAddCancelButton');
        } else {
            this.$emit('clickDetailMapAddButton');
        }
    }

    /**
     * DetailMapManageListから詳細マップ編集のイベントが発火されると呼び出され、
     * 選択された詳細マップを編集するイベントを発火する。
     * @param map 編集対象のマップ
     */
    private editDetailMap(map: Map): void {
        this.$emit('edit', map);
    }

    /**
     * DetailMapManageListから詳細マップ複製のイベントが発火されると呼び出され、
     * 選択された詳細マップを複製するイベントを発火する。
     * @param map 複製対象のマップ
     */
    private duplicateDetailMap(map: Map): void {
        this.$emit('dup', map);
    }

    /**
     * DetailMapManageListから詳細マップ削除のイベントが発火されると呼び出され、
     * 選択された詳細マップを削除するイベントを発火する。
     * @param id 削除対象のマップId
     */
    private deleteDetailMap(id: number): void {
        this.$emit('del', id);
    }

    private shapeAddButtonIcon(): 'add_circle' | 'edit' {
        if (this.spot.getShape() === undefined) {
            return 'add_circle';
        } else {
            return 'edit';
        }
    }

    private switchShapeAddButtonName(): void {
        console.log(this.whileShapeEditingForDetailMapAdding);
        if (this.whileShapeEditing && !this.whileShapeEditingForDetailMapAdding) {
            this.shapeAddButtonName = 'キャンセル';
            this.shapeAddIconIsVisible = false;
        } else {
            this.shapeAddButtonName = '範囲選択';
            this.shapeAddIconIsVisible = true;
        }
    }

    private onClickShapeAddButton(): void {
        if (this.whileShapeEditing) {
            this.$emit('clickAddShapeCancelButton');
        } else {
            this.$emit('clickAddShapeButton');
        }
    }

    @Watch('whileShapeEditingForDetailMapAdding')
    private switchDetailMapAddButtonName(): void {
        if (this.whileShapeEditingForDetailMapAdding) {
            this.detailMapAddButtonName = 'キャンセル';
        } else {
            this.detailMapAddButtonName = '詳細マップ';
        }
    }
}
