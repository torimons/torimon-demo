import Vuex from 'vuex';
import map from '@/components/MapView/index.vue';
import { mapViewGetters, mapViewMutations } from '@/store/newMapViewIndex.ts';
import { testRawMapData } from '../../../resources/testRawMapData';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { GeolocationWrapper } from '@/components/MapView/GeolocationWrapper.ts';
import Map from '@/Map/Map.ts';
import { RawMap } from '@/store/types';
import Spot from '@/Spot/Spot';

describe('components/map/index.ts/ selectMapToDisplay()', () => {
    let wrapper: any;
    beforeEach(() => {
        mapViewMutations.setRootMapForTest(testRawMapData);
        GeolocationWrapper.watchPosition = jest.fn();
        const initMapDisplay = jest.fn();
        const watchStoreForDisplayMap = jest.fn();
        wrapper = shallowMount(map, {
            attachToDocument: true,
            methods: {
                initMapDisplay,
                watchStoreForDisplayMap,
            },
        });
        wrapper.vm.addRouteToMap = jest.fn();
    });
    afterEach(() => {
        wrapper.destroy();
    });

    it('表示ズームレベルがdefaultの場合，rootMapを返す', () => {
        const actualMap: Map = wrapper.vm.selectMapToDisplay() as Map;
        const rootMap: Map = mapViewGetters.rootMap;
        expect(actualMap).toBe(rootMap);
    });

    it('表示レベルがdetailで，ルートマップ中央にスポットがない場合，rootMapを返す', () => {
        mapViewMutations.setDisplayLevel('detail');
        mapViewMutations.setNonExistentOfCenterSpotInRootMap();
        const actualMap: Map = wrapper.vm.selectMapToDisplay();
        const rootMap: Map = mapViewGetters.rootMap;
        expect(actualMap).toBe(rootMap);
    });

    it('表示レベルがdetailで，centerSpotInRootMapがdetailMapを持っていない時，そのrootMapを返す', () => {
        mapViewMutations.setDisplayLevel('detail');
        const testSpot: Spot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        mapViewMutations.setCenterSpotInRootMap(testSpot);
        const actualMap: Map = wrapper.vm.selectMapToDisplay();
        const rootMap: Map = mapViewGetters.rootMap;
        expect(actualMap).toBe(rootMap);
    });

    it('表示レベルがdetailで，centerSpotInRootMapがdetailMapを持っており，初めてそのMapが表示される場合，そのdetailMapの中から一つ目のMapを返す', () => {
        mapViewMutations.setDisplayLevel('detail');
        const testBounds = {
            topL: {lat: 0, lng: 0},
            botR: {lat: 0, lng: 0},
        };
        const testSpot: Spot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        const testDetailMap: Map = new Map(0, 'testMap', testBounds);
        testSpot.addDetailMaps([testDetailMap]);
        mapViewMutations.setCenterSpotInRootMap(testSpot);

        const expectedMap = testDetailMap;
        const actualMap: Map = wrapper.vm.selectMapToDisplay();
        expect(actualMap).toBe(expectedMap);
    });

    it('表示レベルがdetailで，centerSpotInRootMapがdetailMapを持っており，過去に表示されたdetailMapがある場合，そのdetailMapを返す', () => {
        mapViewMutations.setDisplayLevel('detail');
        const testBounds = {
            topL: {lat: 0, lng: 0},
            botR: {lat: 0, lng: 0},
        };
        const testSpot: Spot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        const testDetailMap: Map = new Map(0, 'testMap', testBounds);
        const testDetailMap2: Map = new Map(1, 'testMap2', testBounds);
        testSpot.addDetailMaps([testDetailMap, testDetailMap2]);
        testSpot.setLastViewedDetailMap(testDetailMap2);
        mapViewMutations.setCenterSpotInRootMap(testSpot);

        const expectedMap = testDetailMap2;
        const actualMap = wrapper.vm.selectMapToDisplay();
        expect(actualMap).toBe(expectedMap);
    });
});
