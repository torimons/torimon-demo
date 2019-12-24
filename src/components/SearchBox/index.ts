import { Component, Watch, Vue } from 'vue-property-decorator';
import { mdiAccount } from '@mdi/js';

@Component
export default class SearchBox extends Vue {
    public searchWord: string = '';
}
