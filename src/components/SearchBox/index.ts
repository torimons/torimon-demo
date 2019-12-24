import { Component, Vue } from 'vue-property-decorator';
import { mdiAccount } from '@mdi/js';

@Component
export default class SearchBox extends Vue {
    private userInput: string = '';
}
