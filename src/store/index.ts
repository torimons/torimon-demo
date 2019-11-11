import Vue from 'vue';
import Vuex from 'vuex';
import { MapViewState } from '@/store/types';

interface StoreType {
    mapView: MapViewState;
}
Vue.use(Vuex);

export default new Vuex.Store<StoreType>({});
