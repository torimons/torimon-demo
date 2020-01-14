import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapViewGetters, mapViewMutations } from '@/store';
import SpotItem from '@/components/SpotItem/index.vue';
import { Spot } from '@/store/types';

@Component({
    components: {
        SpotItem,
    },
})
export default class SpotList extends Vue {
    @Prop() public spotSearchResults!: Spot[];
}
