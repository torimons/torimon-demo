import map from '@/components/MapView/index.vue';
import { mapViewGetters, mapViewMutations } from '@/store/newMapViewIndex.ts';
import { testRawMapData } from '../../../resources/testRawMapData';
import { createLocalVue, mount } from '@vue/test-utils';
import { GeolocationWrapper } from '@/components/MapView/GeolocationWrapper.ts';
import 'leaflet/dist/leaflet.css';
import Spot from '@/Spot/Spot';
import Map from '@/Map/Map';

describe('components/MapView watchStoreForMoveMapCenter()', () => {
    let wrapper: any;
    let localVue: any;
    localVue = createLocalVue();
    beforeEach(() => {
        mapViewMutations.setRootMapForTest(testRawMapData);
        GeolocationWrapper.watchPosition = jest.fn();
        const initMapDisplay = jest.fn();
        const watchStoreForDisplayMap = jest.fn();
        wrapper = mount(map, {
            localVue,
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

    it('spotToDisplayInMapCenterが更新された際に，メソッドが呼び出され，zoomlevelと座標，lastViewedDetailMapが更新される', () => {
        const spotInDetailMap: Spot = mapViewGetters.rootMap.getSpots()[0].getDetailMaps()[0].getSpots()[0];
        const parentSpot: Spot = mapViewGetters.rootMap.getSpots()[0];
        const parentMap: Map = mapViewGetters.rootMap.getSpots()[0].getDetailMaps()[0];
        mapViewMutations.setSpotToDisplayInMapCenter(spotInDetailMap);
        const vmMap: L.Map = wrapper.vm.map;
        expect(vmMap.getZoom()).toBe(20.0);
        expect(parentSpot.getLastViewedDetailMap()).toBe(parentMap);
        expect(vmMap.getCenter()).toStrictEqual(spotInDetailMap.getCoordinate());
    });
});

