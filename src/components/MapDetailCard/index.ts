import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MapDetailCard extends Vue {

    private name: string = 'Name section';
    private description: string = 'Desctiption section';
    private mapDetailCardIsVisible: boolean = true;

    /**
     * closeボタンを押すと詳細画面を閉じる
     */
    private close() {
        this.mapDetailCardIsVisible = false;
    }

    /**
     * open mapボタンを押すとMap利用画面に移動
     */
    private openMap() {
        // pass
    }

}
