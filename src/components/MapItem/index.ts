import { Component, Prop, Vue, Emit, Watch, Ref } from 'vue-property-decorator';
import { mapViewMutations } from '@/store';
import Map from '@/Map/Map.ts';
import MapDetailCard from '@/components/MapDetailCard/index.vue';
import MapDetailCardType from '@/components/MapDetailCard';

@Component({
    components: {
        MapDetailCard,
    },
})
export default class MapItem extends Vue {
    @Ref() private mapDialog!: MapDetailCardType;

    @Prop() private map!: Map;
    private name: string = '';
    private description: string = '';

    private mounted() {
        this.name = this.map.getName();
        this.description = this.map.getDescription() || '';
    }

    /**
     * MapDetailCardを開く
     */
    private openDialog() {
        this.mapDialog.dialog = true;
    }

}
