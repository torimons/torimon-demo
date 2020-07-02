import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import MapItem from '@/components/MapItem/index.vue';
import MapDetailCard from '@/components/MapDetailCard/index.vue';
import Map from '@/Map/Map.ts';

@Component({
    components: {
        MapItem,
        MapDetailCard,
    },
})
export default class MapList extends Vue {
    @Prop()
    public mapSearchResults!: Map[];

    private selectedMap: Map | null = null;
    private dialog: boolean = false;

    /**
     * MapItemをクリックするとemitされるイベントにより呼び出され、
     * 詳細マップダイアログを表示する。
     * @param map 選択されたマップ
     */
    private openMapDetailDialog(map: Map) {
        this.dialog = true;
        this.selectedMap = map;
    }

    /**
     * 詳細マップダイアログのキャンセルボタンを押すとemitされるイベントにより呼び出され、
     * 詳細マップダイアログを閉じる。
     */
    private closeMapDetailDialog() {
        this.dialog = false;
    }
}
