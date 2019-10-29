import { MutationTree } from 'vuex';
import { MapState } from '@/store/types';

export const mutations: MutationTree<MapState> = {
    setCurrentSpotID: (state: MapState, newSpotID: string) => {
        state.currentSpotID = newSpotID;
    },
};

export default mutations;