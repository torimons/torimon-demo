import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { mapViewMutations } from '@/store';
import Map from '@/Map/Map.ts';

@Component
export default class MapItem extends Vue {
    // 親からマップ名、作成者名を受けとり表示する
    @Prop() private map!: Map;
    private name: string = '';
    private description: string = '';
    private dialog: boolean = false;

    private mounted() {
        this.name = this.map.getName();
        this.description = this.map.getDescription() || '';
    }

    private closeDialog() {
        this.dialog = false;
    }

    private openDialog() {
        this.dialog = true;
    }

    private openMap() {
        mapViewMutations.setRootMap(this.map);
    }
}
