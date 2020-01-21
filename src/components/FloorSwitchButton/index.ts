import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { store, mapViewGetters, mapViewMutations } from '@/store';
import { MapViewGetters } from '@/store/modules/MapViewModule/MapViewGetters';
import { DisplayLevelType } from '@/store/types';

@Component
export default class FloorSwitchButton extends Vue {

    // floorNamesとfloorMapIdsは表示の関係上,要素を逆順で保持する．
    private floorNames: string[] = [];
    private floorMapIds: number[] = [];

    // 階層ボタンの見た目に関するメンバ
    private selectedFloorButtonIndex: number | undefined = 0;
    private isVisible: boolean = false;

    private spotId: number | null = null;

    public mounted() {
        store.watch(
            (state, getters: MapViewGetters) => getters.displayLevel,
            (value, oldValue) => this.changeButtonIsVisible(value, oldValue),
        );
        store.watch(
            (state, getters: MapViewGetters) => getters.idOfCenterSpotInRootMap,
            (value, oldValue) => this.updateContentOfFloorSwitchButton(value, oldValue),
        );
        // 外部での表示階層の切り替わりをウォッチ
        store.watch(
            (state, getters: MapViewGetters) => {
                if(this.spotId === null) return null;
                return getters.getLastViewedDetailMapId({ parentMapId: mapViewGetters.rootMapId, spotId: this.spotId })
            },
            (value, oldValue) => {
                if(this.spotId !== null) {
                    const spot = mapViewGetters.getSpotById({parentMapId: mapViewGetters.rootMapId, spotId: this.spotId});
                    this.selectedFloorButtonIndex = 
                        spot.detailMapIds.slice().reverse().findIndex((mapId: number) => mapId === value);
                }
            }
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
     * 階層ボタンを押した時にスポットのlastViewedDetailMapIdを更新する．
     * @param floorName 押された階層ボタンの階層名
     */
    private updateLastViewedDetailMapIdOnClick(index: number): void {
        const lastViewedDetailMapId: number = this.floorMapIds[index];
        const parentMapId: number = mapViewGetters.rootMapId;
        const spotId: number | null = mapViewGetters.idOfCenterSpotInRootMap;
        if (spotId === null) {
            return;
        }
        const payload = {
            detailMapId: lastViewedDetailMapId,
            parentSpot: {
                parentMapId,
                spotId,
            },
        };
        mapViewMutations.setLastViewedDetailMapId(payload);
    }

    /**
     * 画面中央の詳細マップ持ちスポットに合わせて階層切り替えボタンの内容を更新する．
     * 下の階が下に表示されるようにセットする．
     */
    private updateContentOfFloorSwitchButton(spotId: number | null, oldSpotId: number | null): void {
        if (spotId === null) {
            this.clearButtonContent();
            return;
        }
        this.spotId = spotId; 
        const parentMapId: number = mapViewGetters.rootMapId;
        const spot = mapViewGetters.getSpotById({parentMapId, spotId});
        if (spot.detailMapIds.length === 0) {
            this.clearButtonContent();
            return;
        }
        this.floorMapIds = spot.detailMapIds.slice().reverse();
        this.floorNames = spot.detailMapLevelNames.slice().reverse();
        const lastViewedDetailMapId: number | null = mapViewGetters.getLastViewedDetailMapId({parentMapId, spotId});
        // 最後に参照された階層（詳細マップ）が存在する場合，その階層が選択された状態にする．
        // 存在しない場合は初期階にあたる階にセットする．
        if (lastViewedDetailMapId != null) {
            this.selectedFloorButtonIndex =
                spot.detailMapIds.slice().reverse().findIndex((mapId: number) => mapId === lastViewedDetailMapId);
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
}
