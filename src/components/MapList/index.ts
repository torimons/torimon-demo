import { Component, Prop, Vue } from 'vue-property-decorator';
import MapItem from '@/components/MapItem/index.vue';
import Map from '@/Map/Map.ts';

@Component({
    components: {
        MapItem,
    },
})
export default class MapList extends Vue {
    @Prop()
    public mapSearchResults!: Map[];
}
