import Vue from 'vue';
import Vuex from 'vuex';
import { createStore, Module } from 'vuex-smart-module';
import { MapViewModule } from '@/store/modules/MapViewModule/MapViewModule';

Vue.use(Vuex);

export const store = createStore(
    MapViewModule,
);
export const mapViewGetters = MapViewModule.context(store).getters;
export const mapViewMutations = MapViewModule.context(store).mutations;
