import Vuex from 'vuex';
import map from '@/components/Map/index.vue';
import { mapViewMutations } from '@/store';
import { testMapViewState2 } from '../../../resources/testMapViewState2';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { GeolocationWrapper } from '@/components/Map/GeolocationWrapper.ts';

describe('components/map/index.ts/ selectMapToDisplay()', () => {
    mapViewMutations.setMapViewState(testMapViewState2);
    GeolocationWrapper.watchPosition = jest.fn();
    const initMapDisplay = jest.fn();
    const watchStoreForDisplayMap = jest.fn();
    const wrapper: any = shallowMount(map, {
        attachToDocument: true,
        methods: {
            initMapDisplay,
            watchStoreForDisplayMap,
        },
    });
    wrapper.vm.addRouteToMap = jest.fn();

    it('表示ズームレベルがdefaultの場合，rootMapIdを返す', () => {
        const actualMapId = wrapper.vm.selectMapToDisplay();
        expect(actualMapId).toBe(testMapViewState2.rootMapId);
    });

    it('表示レベルがdetailで，ルートマップ中央にスポットがない場合，rootMapのIDを返す', () => {
        mapViewMutations.setDisplayLevel('detail');
        mapViewMutations.setNonExistentOfCenterSpotInRootMap();
        const actualMapId = wrapper.vm.selectMapToDisplay();
        expect(actualMapId).toBe(testMapViewState2.rootMapId);
    });

    it('表示レベルがdetailで，centerSpotInRootMapがdetailMapを持っていない時，そのrootMapのIDを返す', () => {
        mapViewMutations.setDisplayLevel('detail');
        mapViewMutations.setIdOfCenterSpotInRootMap(1);
        const actualMapId = wrapper.vm.selectMapToDisplay();
        expect(actualMapId).toBe(testMapViewState2.rootMapId);
    });

    it('表示レベルがdetailで，centerSpotInRootMapがdetailMapを持っており，初めてそのMapが表示される場合，そのdetailMapの中から一つ目のMapのIDを返す', () => {
        mapViewMutations.setDisplayLevel('detail');
        mapViewMutations.setIdOfCenterSpotInRootMap(0);
        const expectedMapId: number = 1;
        const actualMapId = wrapper.vm.selectMapToDisplay();
        expect(actualMapId).toBe(expectedMapId);
    });

    it('表示レベルがdetailで，centerSpotInRootMapがdetailMapを持っており，過去に表示されたdetailMapがある場合，そのdetailMapのIdを返す', () => {
        mapViewMutations.setDisplayLevel('detail');
        mapViewMutations.setIdOfCenterSpotInRootMap(2);
        const expectedMapId: number = 3;
        const actualMapId = wrapper.vm.selectMapToDisplay();
        expect(actualMapId).toBe(expectedMapId);
    });
});
