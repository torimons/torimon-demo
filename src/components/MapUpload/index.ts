import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MapUpload extends Vue {
    private isValidInput: boolean = false;
    private loading: boolean = false;
    private mapName: string = '';
    private mapDescription: string = '';
    private mapNameRules = [
        (v: string) => !!v || 'マップの名前が必要です',
    ];
    private mapDescriptionRules = [
        (v: string) => !!v || 'マップの詳細が必要です',
    ];
}
