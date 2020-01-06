import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import { mapViewGetters, mapViewMutations } from '@/store';
import SpotItem from '@/components/SpotItem/index.vue';

describe('components/SpotItem.vue', () => {
    let localVue: any;
    let wrapper: any;
    let vuetify: any;
    beforeEach(() => {
        vuetify = new Vuetify();
        localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(Vuetify);
        wrapper = shallowMount( SpotItem, {
            localVue,
            vuetify,
        });
    });

    it('SpotList内のSpotItemが選択されるとfocusedSpotIdの更新をおこなう', () => {
        wrapper.vm.selectedSpot = { mapId: 1, spotId: 1 };
        const actualFocusedSpot: { mapId: number, spotId: number} = mapViewGetters.focusedSpot
        expect(actualFocusedSpot).toStrictEqual({ mapId: 1, spotId: 1 });
    });
});
