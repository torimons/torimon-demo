import { Component, Watch, Vue } from 'vue-property-decorator';
import { mdiAccount } from '@mdi/js';

@Component
export default class SearchBox extends Vue {
    public searchWord: string = '';

    // バインドの確認用
    @Watch('searchWord')
    private hoge(): void {
        console.log(this.searchWord);
    }
}
