import { createLocalVue, mount } from '@vue/test-utils';
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
        wrapper = mount( SpotItem, {
            localVue,
            vuetify,
            attachToDocument: true,
            propsData: {
                spotIds: {mapId: 1, spotId: 1},
            },
        });
    });

    it('SpotList内のSpotItemが選択されるとfocusedSpotIdの更新をおこなう', () => {
        expect(wrapper.find('.v-btn').exists()).toBe(true);
        wrapper.find('.v-btn').trigger('click');
        expect(mapViewGetters.focusedSpot).toStrictEqual({mapId: 1, spotId: 1});
    });
});
