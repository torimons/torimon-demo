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
            attachToDocument: true,
        });
    });

    it('SpotList内のSpotItemが選択されるとfocusedSpotIdの更新をおこなう', () => {
        wrapper.vm.spotIds = {mapId: 1, spotId: 1};
        expect(wrapper.find('.v-btn').exists()).toBe(true);
        wrapper.find('.v-btn').trigger('click');
        const actualFocusedSpot: { mapId: number, spotId: number} = mapViewGetters.focusedSpot;
        expect(actualFocusedSpot).toStrictEqual({mapId: 1, spotId: 1});
    });
});
