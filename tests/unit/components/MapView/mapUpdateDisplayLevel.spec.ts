import { mapViewGetters, mapViewMutations } from '@/store';
import { shallowMount } from '@vue/test-utils';
import { GeolocationWrapper } from '@/components/MapView/GeolocationWrapper';
import MapView from '@/components/MapView/index.vue';
import 'leaflet/dist/leaflet.css';
import { testRawMapData } from '../../../resources/testRawMapData';


/**
 * モック用の関数，paramに与えた値を返す関数を返す
 * @param n 返して欲しい値
 * @return nを返す関数
 */
function setReturnOfGetZoom(n: number): (() => {}) {
    return  (jest.fn(() => {
        return n;
    }));
}

describe('components/Map.vue zoomlevel切り替えのテスト', () => {
    let wrapper: any;

    beforeEach(() => {
        mapViewMutations.setRootMapForTest(testRawMapData);
        GeolocationWrapper.watchPosition = jest.fn();
        const initMapDisplay = jest.fn();
        const watchStoreForDisplayMap = jest.fn();
        wrapper = shallowMount(MapView, {
            attachToDocument: true,
            methods: {
                initMapDisplay,
                watchStoreForDisplayMap,
            },
        });
    });

    afterEach(() => {
        // Map components already initialized防止
        wrapper.destroy();
    });

    it('zoomlevelの値によってstateのdisplayLevelを変更する', () => {
        // updateDisplayLevel内部で呼んでいるgetZoom()のモック
        wrapper.vm.map.getZoom = setReturnOfGetZoom(wrapper.vm.defaultZoomLevel);
        // 閾値(19)未満の場合，displayLevelはdefault
        wrapper.vm.updateDisplayLevel();
        const currentDisplayLevelZoomOut = mapViewGetters.displayLevel;
        expect(currentDisplayLevelZoomOut).toBe('default');

        // 閾値(19)以上の場合，displayLevelはdetail
        wrapper.vm.map.getZoom = setReturnOfGetZoom(wrapper.vm.zoomLevelThreshold);
        wrapper.vm.updateDisplayLevel();
        const currentDisplayLevelZoomIn = mapViewGetters.displayLevel;
        expect(currentDisplayLevelZoomIn).toBe('detail');
    });
});
