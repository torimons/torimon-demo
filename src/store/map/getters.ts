import { GetterTree } from 'vuex';
import { MapState, RootState } from '@/store/types';

export const getters: GetterTree<MapState, RootState> = {
    name: (state: MapState) => {
        return state.name;
    },
    currentSpotID: (state: MapState) => {
        return null;
    },
};

export default getters;