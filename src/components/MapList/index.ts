import { Component, Prop, Vue } from 'vue-property-decorator';
import MapItem from '@/components/MapItem/index.vue';
import { RawMap } from '@/store/types';

@Component({
    components: {
        MapItem,
    },
})
export default class MapList extends Vue {
    @Prop() 
    public mapSearchResults!: RawMap[];

    /**
     * MapItemからemitを受け取ると，MapSearchにMapList(自身)を
     * 非表示にするようにemitする．
     */
    public hideMapList() {
        this.$emit('hideMapList', false);
    }
}