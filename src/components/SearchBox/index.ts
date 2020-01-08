import { Component, Watch, Vue, Emit } from 'vue-property-decorator';

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

    @Emit('searchWordInput')
    private sendSearchWord(): string {
        return this.searchWord;
    }

    @Watch('searchWord')
    private onChangeSearchWord(): void {
        this.sendSearchWord();
    }
}
