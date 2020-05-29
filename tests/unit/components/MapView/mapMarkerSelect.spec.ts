import { mapViewGetters, mapViewMutations } from '@/store/newMapViewIndex.ts';
import { shallowMount } from '@vue/test-utils';
import { GeolocationWrapper } from '@/components/MapView/GeolocationWrapper';
import MapView from '@/components/MapView';
import 'leaflet/dist/leaflet.css';
import { testRawMapData } from '../../../resources/testRawMapData';
import DefaultSpotMarker from '@/components/MapView/Marker/DefaultSpotMarker';
import Spot from '@/Spot/Spot';

describe('components/Map.vue マーカー選択関連のテスト', () => {
    let wrapper: any;
    beforeEach(() => {
        mapViewMutations.setRootMapForTest(testRawMapData);
        GeolocationWrapper.watchPosition = jest.fn();
        const initMapDisplay = jest.fn();
        wrapper = shallowMount(MapView, {
            attachToDocument: true,
            methods: {
                initMapDisplay,
            },
        });
    });

    afterEach(() => {
        // Map components already initialized防止
        wrapper.destroy();
    });

    it('現在表示中のマーカーの中からスポットによってマーカーを取得する', () => {
        const markers: DefaultSpotMarker[] = [];
        const testSpots: Spot[] = [];
        // 五つのマーカーを作成
        for (let i = 0; i < 5; i++) {
            const testSpot = new Spot(i, 'testSpot', { lat: 0, lng: 0 });
            testSpots.push(testSpot);
            markers.push(new DefaultSpotMarker(testSpot));
        }
        wrapper.vm.spotMarkers = markers;
        // 存在しないスポットを指定した場合
        expect(wrapper.vm.findMarker(new Spot(99, 'testSpot', { lat: 0, lng: 0 }))).toBe(null);
        // 存在するスポットの場合
        const foundMarker: DefaultSpotMarker = wrapper.vm.findMarker(testSpots[0]);
        const expectedMarker = markers[0];
        expect(foundMarker).not.toBeNull();
        expect(foundMarker).toBe(expectedMarker);
    });

    it('onMapClickでfocusedSpotを非選択状態にしてSpotInfoを非表示にする', () => {
        const testSpot: Spot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        const marker = new DefaultSpotMarker(testSpot);
        marker.setSelected(true);
        mapViewMutations.setFocusedSpot(testSpot);
        // focusedMarkerを探す部分をモック
        wrapper.vm.findMarker = jest.fn((focusedSpot) => {
            return marker;
        });
        wrapper.vm.onMapClick();
        // SpotItemが非表示になっている
        expect(mapViewGetters.spotInfoIsVisible).toBe(false);
    });
});
