import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MapItem extends Vue {
    // 親からマップ名、作成者名を受けとり表示する
    @Prop()
    private mapName!: string;
    private userName!: string; 

    /**
     * mapItemがクリックされると呼ばれ，mapListを非表示にする．
     * ただし，直接非表示にするのでなく，MapItem -> MapList -> MapSearchまで
     * Emitして，MapSearchで最終的に非表示にする．
     */
    public hideMapList() {
        this.$emit('hideMapList');
    }
}
