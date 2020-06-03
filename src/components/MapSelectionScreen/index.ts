import { Component, Vue } from 'vue-property-decorator';
import MapSearch from '@/components/MapSearch';

@Component({
    components: {
        MapSearch,
        // DetailPopup,
    },
})
export default class MapSelection extends Vue {
}
