import { Component, Watch, Vue } from 'vue-property-decorator';
import { mdiAccount } from '@mdi/js';

@Component
export default class SearchBox extends Vue {
    public searchWord: string = '';
    private onFocus: boolean = false;

    private focus(): void {
        this.onFocus = true;
    }
    private cancel(): void {
        this.onFocus = false;
    }
}
