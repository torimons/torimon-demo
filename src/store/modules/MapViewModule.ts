import { Mutation, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '..';
import { MapState, Spot, SpotInfo, SpotForMap, Bounds } from '@/store/types';

/**
 * MapViewの状態管理を行うVuexModuleクラス
 */
@Module({ dynamic: true, store, name: 'mapView', namespaced: true })
export class MapViewModule extends VuexModule {

    /**
     * マップの情報全般
     * - 単体テスト以外の目視テスト等のために
     *   MapStateで初期化
     * - 将来的にはvuexのmutationで登録する
     */
    public map: MapState =  {
        id: 0,
        name: 'SougouGakusyuPlaza',
        currentSpotId: 0,
        spots: [
            {
                id: 0,
                name: '101',
                location: {
                    lat: 33.5954558,
                    lng: 130.2179447,
                },
                floor: 1,
                gateNodeIds: [0],
                parentSpotIds: [],
            },
        ],
        bounds: {
            topL: {
                lat: 33.5954678,
                lng: 130.2177802,
            },
            botR: {
                lat: 33.5954678,
                lng: 130.2177802,
            },
        },
    };

    /**
     * SpotInfoコンポーネントの表示非表示状態を保持
     */
    public spotInfoIsVisible: boolean = false;

    /**
     * Mapコンポーネントが扱うマップの範囲を返す
     * @return マップの範囲
     */
    get mapBounds(): Bounds {
        return this.map.bounds;
    }

    /**
     * Mapコンポーネントがアイコン表示のために必要なスポットの情報を返す
     * @return Mapコンポーネントが必要なスポットの情報
     */
    get spotsForMap(): SpotForMap[] {
        const spots: Spot[] = this.map.spots;
        let spotsForMap: SpotForMap[] = [];
        spots.forEach(spot => {
            spotsForMap.push({
                id: spot.id,
                name: spot.name,
                location: spot.location,
                floor: spot.floor,
            });
        })
        return spotsForMap;
    }

    /**
     * SpotInfoコンポーネントが表示する情報を返す
     * @return SpotInfoコンポーネントに必要な情報
     */
    get infoOfCurrentSpot(): SpotInfo {
        const currentSpotId: number = this.map.currentSpotId;
        const spot: Spot = this.map.spots[currentSpotId];
        const spotInfo: SpotInfo = {
            id: spot.id,
            name: spot.name,
            floor: spot.floor,
        };
        return spotInfo;
    }

    /**
     * Mapコンポーネント上でフォーカスされているスポットのIDを更新する
     * @param newSpotId 新しいスポットのID
     */
    @Mutation
    public setCurrentSpotId(newSpotId: number): void {
        this.map.currentSpotId = newSpotId;
    }

    /**
     * mapの情報をset
     * - 単体テストの入力用の仮メソッド
     * @param mapState マップの状態
     */
    @Mutation
    public setMapState(mapState: MapState): void {
        this.map = mapState;
    }

    /**
     * SpotInfoコンポーネントの表示状態をset
     * - 単体テストの入力用の仮メソッド
     * @param spotInfoIsVisible SpotInfoコンポーネントが表示状態なら真
     */
    @Mutation
    public setSpotInfoIsVisible(spotInfoIsVisible: boolean): void {
        this.spotInfoIsVisible = spotInfoIsVisible;
    }
}

export const mapViewStore = getModule(MapViewModule);
