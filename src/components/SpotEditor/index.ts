import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DetailMapManageList from '@/components/DetailMapManageList/index.vue';
import Map from '@/Map/Map';
import Spot from '@/Spot/Spot';

@Component({
    components: {
        DetailMapManageList,
    },
})
export default class SpotEditor extends Vue {
    @Prop()
    public spot!: Spot;
    @Prop()
    public isVisible!: boolean;
    public attachment: [{name: string, url: string}] = [{name: '', url: ''}];
    public dialog: boolean = false;

    /**
     * DetailMapManageListから詳細マップ追加のイベントが発火されると呼び出され、
     * 詳細マップ追加のイベントを発火する。
     */
    private addDetailMap(): void {
        this.$emit('add');
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
}
