import { Component, Vue, Prop } from 'vue-property-decorator';
import Map from '@/Map/Map.ts';
import { mapViewMutations } from '@/store';

@Component
export default class MapDetailCard extends Vue {
    public dialog: boolean = false;

    @Prop() private map!: Map;
    private name: string = 'Name section';
    private description: string = 'Desctiption section';

    private mounted() {
        this.name = this.map.getName();
        this.description = this.map.getDescription() || '';
    }

    /**
     * closeボタンを押すと詳細画面を閉じる
     */
    private close() {
        this.dialog = false;
    }

    /**
     * open mapボタンを押すとMap利用画面に移動
     */
    private openMap() {
        mapViewMutations.setRootMap(this.map);
    }

}
