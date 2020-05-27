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

    private spot: Spot | undefined;

    public mounted() {
        store.watch(
            (state, getters: MapViewGetters) => getters.displayLevel,
            (value, oldValue) => this.changeButtonIsVisible(value, oldValue),
        );
        store.watch(
            (state, getters: MapViewGetters) => getters.centerSpotInRootMap,
            (value, oldValue) => this.updateContentOfFloorSwitchButton(value, oldValue),
        );
        this.watchFloorMapChangeOfDisplayedSpot();
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
     * @param floorName 押された階層ボタンの階層名
     */
    private updateLastViewedDetailMapOnClick(index: number): void {
        const lastViewedDetailMapId: number = this.floorMapIds[index];
        const spot: Spot | null = mapViewGetters.centerSpotInRootMap;
        if (spot === null) {
            return;
        }
        // spotのlastViewedDetailMapを更新する。
        const lastViewedDetailMap: Map | null = spot.findMap(lastViewedDetailMapId);
        if (lastViewedDetailMap === null) {
            return;
        }
        spot.setLastViewedDetailMap(lastViewedDetailMap);
    }

    /**
     * 画面中央の詳細マップ持ちスポットに合わせて階層切り替えボタンの内容を更新する．
     * 下の階が下に表示されるようにセットする．
     * @params spotId 更新後のスポットID
     * @params oldSpotId 更新前のスポットID．未使用
     */
    private updateContentOfFloorSwitchButton(newSpot: Spot | null, oldSpot: Spot | null): void {
        if (newSpot === null) {
            this.clearButtonContent();
            return;
        }
        // const parentMapId: number = mapViewGetters.rootMapId;
        const rootMap: Map = mapViewGetters.rootMap;
        this.spot = newSpot;
        const detailMaps: Map[] = newSpot.getDetailMaps();
        if (detailMaps.length === 0) {
            this.clearButtonContent();
            return;
        }
        this.floorMapIds = (detailMaps.map((m: Map) => m.getId())).reverse();
        this.floorNames = (detailMaps.map((m: Map) => m.getFloorName())).reverse();

        const lastViewedDetailMap: Map | undefined = newSpot.getLastViewedDetailMap();
        // 最後に参照された階層（詳細マップ）が存在する場合，その階層が選択された状態にする．
        // 存在しない場合は初期階にあたる階にセットする．
        if (lastViewedDetailMap !== undefined) {
            this.selectedFloorButtonIndex =
                detailMaps.slice().reverse().findIndex((m: Map) => m === lastViewedDetailMap);
        } else {
            this.selectedFloorButtonIndex = this.floorMapIds.length - 1;
        }
    }

    /**
     * displayLevelに合わせて階層切り替えボタンの表示/非表示を切り替える．
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
    private watchFloorMapChangeOfDisplayedSpot(): void {
        store.watch(
            (state, getters: MapViewGetters) => {
                if (this.spot === undefined) {
                    return null;
                }
                if (this.spot.getDetailMaps().length > 0) {
                    const lastViewedDetailMap = this.spot.getLastViewedDetailMap();
                    if (lastViewedDetailMap === undefined) {
                        return null;
                    }
                    return lastViewedDetailMap.getId();
                }
                return null;
            },
            (newFloorMapId, oldFloorMapId) => {
                if (newFloorMapId !== null) {
                    const spot: Spot | null = mapViewGetters.rootMap.findSpot(newFloorMapId);
                    if (spot === null) {
                        return;
                    }
                    const detailMaps = spot.getDetailMaps();
                    this.selectedFloorButtonIndex =
                        detailMaps.slice().reverse().findIndex((map: Map) => map.getId() === newFloorMapId);
                }
            },
        );
    }
}