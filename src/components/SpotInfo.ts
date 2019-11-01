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
     * @return 現在選択されているスポットのID
     */
    private get currentSpotID(): number {
        return this.$store.getters.getCurrentSpotID;
    }

    /**
     * SpotInfoコンポーネントの可視化状態をvuexから取得する．
     * @return spotInfoコンポーネントの可視化状態
     */
    private get spotInfoVisible(): boolean {
        return this.$store.getters.getSpotInfoVisible;
    }

    /**
     * 選択されているスポットIDの変更を検知すると，spotName, othersを更新して表示内容を更新する．
     */
    @Watch('currentSpotID')
    private spotIDChanged(): void {
        const spot: any = this.$store.getters.getInfoOfCurrentSpot;
        if (spot) {
            this.spotName = spot.name;
            this.others = spot.others;
        } else {
            this.spotName = 'no_name';
            this.others = {};
        }
    }

    /**
     * コンポーネントの表示/非表示を，visibleを更新して切り替える.．
     */
    @Watch('spotInfoVisible')
    private spotInfoVisibleChanged(): void {
        this.visible = this.$store.getters.getSpotInfoVisible;
    }

}
