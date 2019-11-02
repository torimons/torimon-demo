import { Module } from 'vuex';
import { getters } from './getters';
import { mutations } from './mutations';
import { MapViewState, RootState } from '@/store/types';

export const state: MapViewState = {
    map: {
        id: 0,
        name : "SougouGakusyuPlaza",
        currentSpotID: 0,
        spots: [
            {
                id: 0,
                name : "101",
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
                lng: 130.2177802
            }
        },
    },
    spotInfoIsVisible: false,
};


export const map: Module<MapViewState, RootState> = {
    namespaced: true,
    state,
    getters,
    mutations,
};