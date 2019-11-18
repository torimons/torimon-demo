import { mapViewStore } from '@/store/modules/MapViewModule';
import { SpotForMap, Coordinate } from '@/store/types';
import Vue from 'vue';
import Map from '@/components/Map.vue';

describe('components/Map.vue', () => {
    beforeEach(() => {
        const event = new Event('testEvent');
    });

    it('addMarkersのテスト', () => {
        const map = new Vue(Map).$mount();
    });
});
