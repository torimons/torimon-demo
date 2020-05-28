import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { store, mapViewGetters, mapViewMutations } from '@/store/newMapViewIndex.ts';
import { MapViewGetters } from '@/store/modules/newMapViewModule/MapViewGetters';
import { DisplayLevelType } from '@/store/types';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

@Component
export default class FloorSwitchButton extends Vue {

    // floorNamesとfloorMapIdsは表示の関係上,要素を逆順で保持する．
    private floorNames: Array<string | undefined> = [];
    private floorMapIds: number[] = [];

    // 階層ボタンの見た目に関するメンバ
    private selectedFloorButtonIndex: number | undefined = 0;
    private isVisible: boolean = false;

    private centerSpotWithFloors: Spot | undefined;

    public mounted() {
        store.watch(
            (state, getters: MapViewGetters) => getters.displayLevel,
            (value, oldValue) => this.changeButtonIsVisible(value, oldValue),
        );
        store.watch(
            (state, getters: MapViewGetters) => getters.centerSpotInRootMap,
            (value, oldValue) => this.updateContentOfFloorSwitchButton(value, oldValue),
        );
    }

    /**
     * 階層ボタンの内容を初期化する．
     */
    private clearButtonContent(): void {
        this.floorNames = [];
        this.floorMapIds = [];
        this.selectedFloorButtonIndex = undefined;
    }

    /**
     * 階層ボタンを押した時にスポットのlastViewedDetailMapを更新する．
     * @param index 階層ボタンのインデックス
     */
    private updateLastViewedDetailMapOnClick(index: number): void {
        const lastViewedDetailMapId: number = this.floorMapIds[index];
        if (this.centerSpotWithFloors === undefined) {
            return;
        }
        const lastViewedDetailMap: Map | null = this.centerSpotWithFloors.findMap(lastViewedDetailMapId);
        if (lastViewedDetailMap === null) {
            return;
        }
        this.centerSpotWithFloors.setLastViewedDetailMap(lastViewedDetailMap);
    }

    /**
     * 画面中央の詳細マップ持ちスポットに合わせて階層切り替えボタンの内容を更新する．
     * 下の階が下に表示されるようにセットする．
     * @params newCenterSpot 更新後のスポット
     * @params oldCenterSpot 更新前のスポット
     */
    private updateContentOfFloorSwitchButton(newCenterSpot: Spot | null, oldCenterSpot: Spot | null): void {
        if (newCenterSpot === null) {
            this.clearButtonContent();
            return;
        }
        const detailMaps: Map[] = newCenterSpot.getDetailMaps();
        if (detailMaps.length === 0) {
            this.clearButtonContent();
            return;
        }
        this.centerSpotWithFloors = newCenterSpot;
        this.floorMapIds = (detailMaps.map((m: Map) => m.getId())).reverse();
        this.floorNames = (detailMaps.map((m: Map) => m.getFloorName())).reverse();

        const lastViewedDetailMap: Map | undefined = newCenterSpot.getLastViewedDetailMap();
        // 最後に参照された階層（詳細マップ）が存在する場合，その階層が選択された状態にする．
        // 存在しない場合は初期階にあたる階にセットする．
        if (lastViewedDetailMap !== undefined) {
            const index: number = detailMaps
                .findIndex((m: Map) => m.getId() === lastViewedDetailMap.getId());
            this.selectedFloorButtonIndex = detailMaps.length - index - 1;
        } else {
            this.selectedFloorButtonIndex = detailMaps.length - 1;
        }
    }

    /**
     * displayLevelに合わせて階層切り替えボタンの表示/非表示を切り替える．
     * @param newDisplayLevel 更新後のdisplayLevel
     * @param oldDisplayLevel 更新後のdisplayLevel
     */
    private changeButtonIsVisible(newDisplayLevel: DisplayLevelType, oldDisplayLevel: DisplayLevelType): void {
        if (newDisplayLevel === 'detail') {
            this.isVisible = true;
        } else {
            this.isVisible = false;
        }
    }

    /**
     * 外部コンポーネントでのLastViewedDetailMapIdの切り替わりをウォッチして
     * ボタンの選択状態に反映
     */
    @Watch('centerSpotWithFloors', {deep: true})
    private watchFloorMapChangeOfDisplayedSpot(newSpot: Spot | undefined, oldSpot: Spot | undefined): void {
        if (newSpot === undefined) {
            return;
        }
        const lastViewedDetailMap: Map | undefined = newSpot.getLastViewedDetailMap();
        if (lastViewedDetailMap === undefined) {
            return;
        }
        const detailMaps: Map[] = newSpot.getDetailMaps();
        const index: number = detailMaps
            .findIndex((m: Map) => m.getId() === lastViewedDetailMap.getId());
        this.selectedFloorButtonIndex = detailMaps.length - index - 1;
    }
}
