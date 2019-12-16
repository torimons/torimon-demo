import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapViewStore } from '@/store/modules/MapViewModule';
import { DisplayLevelType } from '@/store/types';

@Component
export default class FloorSwitchButton extends Vue {

    private floorNames: string[] = [];
    private floorMapIds: number[] = [];
    private floorIndex: number | null = null;
    private isVisible: boolean = false;

    public mounted() {
        // pass
    }

    /**
     * changeButtonContentで監視するプロパティ
     */
    get idOfCenterSpotWithDetailMap(): number | null {
        return mapViewStore.idOfCenterSpotWithDetailMap;
    }

    /**
     * 画面中央の詳細マップ持ちスポットに合わせて，
     * 階層切り替えボタンの内容を変更する．
     */
    @Watch('idOfCenterSpotWithDetailMap')
    private changeButtonContent(): void {
        const parentMapId = mapViewStore.rootMapId;
        const spotId = mapViewStore.idOfCenterSpotWithDetailMap;
        if (spotId === null) {
            this.floorNames = [];
            this.floorMapIds = [];
            this.floorIndex = null;
        } else {
            const spot = mapViewStore.getSpotById({
                parentMapId,
                spotId,
            });
            // スポットが詳細マップを持っているならばボタンの内容を更新
            if (spot.detailMapIds.length > 0) {
                this.floorMapIds = spot.detailMapIds;
                this.floorNames = spot.detailMapLevelNames;
            }
            // 最後に参照されたマップ（階層）がある場合，その階層を選択した状態にする
            const lastViewedId = mapViewStore.getLastViewedDetailMapId({parentMapId, spotId});
            if (lastViewedId != null) {
                this.floorIndex = spot.detailMapIds.findIndex((id) => id === lastViewedId);
            } else {
                this.floorIndex = 0;
            }
        }
    }

    /**
     * changeButtonIsVisibleで監視するプロパティ
     */
    get displayLevel(): DisplayLevelType {
        return mapViewStore.getDisplayLevel();
    }

    /**
     * displayLevelに合わせて階層切り替えボタンの表示/非表示を切り替える．
     */
    @Watch('displayLevel')
    private changeButtonIsVisible(): void {
        const displayLevel = mapViewStore.getDisplayLevel();
        if (displayLevel === 'default') {
            this.isVisible = false;
        } else {
            this.isVisible = true;
        }
    }
}
