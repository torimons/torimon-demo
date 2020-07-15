import { Component, Prop, Vue, Emit, Watch, Ref } from 'vue-property-decorator';
import Map from '@/Map/Map.ts';

@Component
export default class MapItem extends Vue {
    @Prop() private map!: Map;
    private name: string = '';
    private description: string = '';
    private attachment: string = '';

    private mounted() {
        this.name = this.map.getName();
        this.description = this.map.getDescription() || '';
    }

    /**
     * MapItemがクリックされると呼び出され、詳細マップダイアログを表示する
     * イベントをemitする
     */
    private openDialog(): void {
        this.$emit('openDialog', this.map);
    }

}
