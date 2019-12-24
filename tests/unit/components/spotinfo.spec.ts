import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import SpotInfo from '@/components/SpotInfo.vue';

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

describe('components/SpotInfo.vue', () => {
    let store: any;
    let localVue: any;
    let wrapper: any;
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuex);
        store = new Vuex.Store({
            state,
            getters: {
                getCurrentSpotID: () => store.state.currentSpotID,
                // spotの型はまだ未定義なのでanyとしています．
                getInfoOfCurrentSpot:　() =>
                    store.state.map.spots.find((spot: any) => spot.id === store.getters.getCurrentSpotID),
                getSpotInfoVisible: () => store.state.spotInfoVisible,
            },
        });
        wrapper = shallowMount( SpotInfo, {
            localVue,
            store,
        });
    });

    it('選択されているスポットIDの変化を検知するとコンポーネントのspotNameが変化する．', () => {
        // 存在するspotIDが指定された場合，対応するspotNameに変化する
        store.state.currentSpotID = 0;
        expect(wrapper.vm.spotName).toBe('spot0');
        store.state.currentSpotID = 1;
        expect(wrapper.vm.spotName).toBe('spot1');
        // 存在しないspotIDが指定された場合，no_nameに変化する
        store.state.currentSpotID = null;
        expect(wrapper.vm.spotName).toBe('no_name');
        store.state.currentSpotID = 999;
        expect(wrapper.vm.spotName).toBe('no_name');
    });

    it('可視化状態変数を参照して，コンポーネントの表示，非表示を切り替える', () => {
        // 初期状態では見えない状態
        expect(wrapper.isVisible()).toBe(false);
        // spoInfoVisibleが変わると見える
        store.state.spotInfoVisible = true;
        expect(wrapper.isVisible()).toBe(true);
    });

    it('stateの変化に合わせて，htmlの表示内容が切り替わる', () => {
        // 存在するspotIDが指定された場合，対応するspotNameに変化する
        store.state.currentSpotID = 0;
        expect(wrapper.find('p').text()).toBe('spot0');
        store.state.currentSpotID = 1;
        expect(wrapper.find('p').text()).toBe('spot1');
        // 存在しないspotIDが指定された場合，no_nameに変化する
        store.state.currentSpotID = null;
        expect(wrapper.find('p').text()).toBe('no_name');
        store.state.currentSpotID = 999;
        expect(wrapper.find('p').text()).toBe('no_name');
    });

});
