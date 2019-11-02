import { Mutation, MutationAction, Action, VuexModule, getModule, Module } from 'vuex-module-decorators';
import store from '..';
import { MapViewState, MapState, Spot, SpotInfo, Bounds } from '../types';

@Module({ dynamic: true, store, name: 'mapView', namespaced: true })
export class MapViewModule extends VuexModule {
    public map: MapState =  {
        id: 0,
        name : 'SougouGakusyuPlaza',
        currentSpotId: 0,
        spots: [
            {
                id: 0,
                name : '101',
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
    public spotInfoIsVisible: boolean = false;


    /** Mapコンポーネントが扱うMapの範囲を返す
     * @return マップの範囲
     */
    get mapBounds(): Bounds {
        return this.map.bounds;
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

    @Mutation
    public setCurrentSpotID(newSpotId: number) {
        this.map.currentSpotId = newSpotId;
    }
}

export const mapViewStore = getModule(MapViewModule);
