import { GetterTree } from 'vuex';
import { 
    MapViewState, 
    Bounds, 
    Spot,
    SpotInfo, 
    RootState 
} from '@/store/types';

export const getters: GetterTree<MapViewState, RootState> = {
    /**
     * Mapコンポーネント上でフォーカスされているスポットのID
     * を返す
     * @return スポットID
     */
    getCurrentSpotID: (state: MapViewState): number => {
        return state.map.currentSpotID;
    },

    /**
     * SpotInfoコンポーネントが表示されているかどうかを返す 
     * @return SpotInfoが表示の場合，真．非表示の場合，偽．
     */
    getSpotInfoIsVisible: (state: MapViewState): boolean => {
        return state.spotInfoIsVisible;
    },

    /** Mapコンポーネントが扱うMapの範囲を返す
     * @return マップの範囲
     */
    getMapBounds: (state: MapViewState): Bounds => {
        return state.map.bounds;
    },

    /**
     * SpotInfoコンポーネントが表示する情報を返す
     * @return SpotInfoコンポーネントに必要な情報
     */
    getInfoOfCurrentSpot: (state: MapViewState): SpotInfo => {
        const currentSpotID: number = state.map.currentSpotID;
        const spot: Spot = state.map.spots[currentSpotID];
        const spotInfo: SpotInfo = {
            id: spot.id,
            name: spot.name,
            floor: spot.floor,
        }
        return spotInfo;
    }
};


export default getters;