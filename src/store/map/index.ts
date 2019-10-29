import { Module } from 'vuex';
import { getters } from './getters';
import { mutations } from './mutations';
import { MapState, RootState } from '@/store/types';

export const state: MapState = {
    id: "0",
    name : "SougouGakusyuPlaza",
    currentSpotID: "0",
    spot: [
        {
            id: "0",
            name : "101",
            location: {
                lat: 33.5954558,
                lng: 130.2179447,
            },
            floor: 1,
            gate_node_ids: ["0"],
            parent_spot_ids: [],
            detail_map_id: "",
            others: {}
        },
    ],
    bounds: {
        top_l: {
            lat: 33.5954678,
            lng: 130.2177802,
        },
        bot_r: {
            lat: 33.5954678,
            lng: 130.2177802
        }
    },
    parent_spot_id: ""
};


export const map: Module<MapState, RootState> = {
    namespaced: true,
    state,
    getters,
    mutations,
};