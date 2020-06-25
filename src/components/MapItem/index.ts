import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MapItem extends Vue {
    // 親からマップ名、作成者名を受けとり表示する
    @Prop()
    private mapName!: string;
    private userName!: string;
}
