import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import SpotItem from '@/components/SpotItem/index.vue';

const state = {
    currentSpotID: null,
    spotInfoVisible: false,
    map: {
        spots: [
            {
                id: 0,
                    name: 'spot0',
                others: {},
            },
            {
                id: 1,
                name: 'spot1',
                others: {},
            },
        ],
    },
};

describe('components/SpotItem.vue', () => {
    let store: any;
    let localVue: any;
    let wrapper: any;
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuex);
        store = new Vuex.Store({
            state,
            getters: {
                getSelectedSpotID: () => store.state.SelectedSpotID,
            },
        });
        wrapper = shallowMount( SpotItem, {
            localVue,
            store,
        });
    });

    it('SpotList内のSpotItemが選択されるとfocusedSpotIdの更新をおこなう', () => {

    });
});
