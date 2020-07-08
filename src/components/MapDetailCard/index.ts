import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Map from '@/Map/Map.ts';
import { mapViewMutations } from '@/store';
import MapView from '@/components/MapView/index.vue';

@Component({
    components: {
        MapView,
    },
})
export default class MapDetailCard extends Vue {
    @Prop()
    public map!: Map;

    private name: string = '';
    private description: string = '';
    private attachment: string = '';

    private mounted() {
        this.updateContent();
    }

    /**
     * MapDetailCardの内容を更新する
     */
    @Watch('map')
    private updateContent() {
        mapViewMutations.setRootMap(this.map);
        this.name = this.map.getName();
        this.description = this.map.getDescription() || '';
        this.attachment = 'https://picsum.photos/id/' + String(Math.abs(this.map.getId())) + '/200/300';
    }

    /**
     * open mapボタンを押すとMapをセットして利用画面に移動
     */
    private openMap() {
        mapViewMutations.setRootMap(this.map);
    }

    /**
     * closeボタンを押すと詳細画面を閉じる
     */
    private close() {
        this.$emit('closeDialog');
    }

}
