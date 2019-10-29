import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex'
import SpotInfo from '@/components/SpotInfo.vue';

const state = {
    currentSpotID: null,
    map: {
        spots: [
            {
                id: 0,
                    name: "spot0",
                others: {}
            },
            {
                id: 1,
                name: "spot1",
                others: {}
            }
        ]
    }
}

describe('components/SpotInfo.vue', () => {
    let store: any;
    let localVue: any;
    let wrapper: any;
    beforeEach(() => {
        localVue = createLocalVue()
        localVue.use(Vuex)
        store = new Vuex.Store({
            state,
            getters: {
                getCurrentSpotID: () => store.state.currentSpotID,
                getInfoOfCurrentSpot:　() =>
                    store.state.map.spots.find((spot:any) => spot.id === store.getters.getCurrentSpotID)
            }
        });
        wrapper = shallowMount( SpotInfo, {
            localVue,
            store
        });
    });

    it('currentSpotIDの変化を検知してspot_nameが変化する．', () => {
        // 存在するspotIDが指定された場合，対応するspot_nameに変化する
        store.state.currentSpotID = 0;
        expect(wrapper.vm.spot_name).toBe("spot0");
        store.state.currentSpotID = 1;
        expect(wrapper.vm.spot_name).toBe("spot1");
        // 存在しないspotIDが指定された場合，no_nameに変化する
        store.state.currentSpotID = null;
        expect(wrapper.vm.spot_name).toBe("no_name");
        store.state.currentSpotID = 999;
        expect(wrapper.vm.spot_name).toBe("no_name");
    });
});
