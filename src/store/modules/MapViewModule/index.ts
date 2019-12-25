import { Module } from 'vuex-smart-module';
import { MapViewState } from './MapViewState';
import { MapViewGetters } from './MapViewGetters';
import { MapViewMutations } from './MapViewMutations';

export const MapViewModule = new Module({
    state: MapViewState,
    getters: MapViewGetters,
    mutations: MapViewMutations,
});
