import { MutationTree } from 'vuex';
import { MapViewState } from '@/store/types';

export const mutations: MutationTree<MapViewState> = {
    /**
     * Mapコンポーネント上でフォーカスされているSpotのIDを更新する
     * @param 
     */
    setCurrentSpotID: (state: MapViewState, newSpotID: number) => {
        state.map.currentSpotID = newSpotID;
    },
};

export default mutations;