import { Component, Prop, Vue } from 'vue-property-decorator';
import SpotItem from '@/components/SpotItem/index.vue';
import { Spot } from '@/store/types';

@Component({
    components: {
        SpotItem,
    },
})
export default class SpotList extends Vue {
    @Prop() public spotSearchResults!: Spot[];

    /**
     * SpotItemからemitを受け取ると，SpotSearchにSpotList(自身)を
     * 非表示にするようにemitする．
     */
    public hideSpotList() {
        this.$emit('hideSpotList', false);
    }
}
