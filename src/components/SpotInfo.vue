<template>
    <div class="spot-info" v-show="visible">
        <p>{{ spot_name }}</p>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
/**
 * マップ上でスポットを選択した際に表示されるコンポーネント．
 * vuex上のstateを見て，表示内容，および表示/非表示を自動的に切り替える．
 */
export default class SpotInfo extends Vue {

    private spotName: string = '';
    private others: any = {};
    private visible: boolean = false;

    /**
     * 現在選択されているスポットIDをvuexから取得する
     * @param なし
     * @return 現在選択されているスポットのID
     */
    private get currentSpotID(): number {
        return this.$store.getters.getCurrentSpotID;
    }

    /**
     * SpotInfoコンポーネントの可視化状態をvuexから取得する算
     * @param　なし
     * @return spotInfoコンポーネントの可視化状態
     */
    private get spotInfoVisible(): boolean {
        return this.$store.getters.getSpotInfoVisible;
    }

    /**
     * 選択されているスポットIDの変更を検知すると，表示内容を更新する
     * @param なし
     * @return なし
     */
    @Watch('currentSpotID')
    private spotIDChanged(): void {
        let spot: any = this.$store.getters.getInfoOfCurrentSpot;
        if (spot) {
            this.spotName = spot.name;
            this.others = spot.others;
        } else {
            this.spotName = "no_name";
            this.others = {};
        }
    }

    /**
     * コンポーネントの表示/非表示を切り替える
     * @param なし
     * @return なし
     */
    @Watch('spotInfoVisible')
    private spotInfoVisibleChanged(): void {
        this.visible = this.$store.getters.getSpotInfoVisible;
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
