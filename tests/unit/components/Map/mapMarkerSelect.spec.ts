import { mapViewGetters, mapViewMutations } from '@/store';
import { MapViewState } from '@/store/types';
import { shallowMount } from '@vue/test-utils';
import { GeolocationWrapper } from '@/components/Map/GeolocationWrapper';
import Map from '@/components/Map';
import 'leaflet/dist/leaflet.css';
import { cloneDeep } from 'lodash';
import { testMapViewState } from '../../../resources/testMapViewState';
import DefaultSpotMarker from '@/components/Map/Marker/DefaultSpotMarker';

const mapViewStoreTestData: MapViewState = cloneDeep(testMapViewState);

describe('components/Map.vue マーカー選択関連のテスト', () => {
    let wrapper: any;
    beforeEach(() => {
        mapViewMutations.setMapViewState(mapViewStoreTestData);
        GeolocationWrapper.watchPosition = jest.fn();
        const initMapDisplay = jest.fn();
        wrapper = shallowMount(Map, {
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

    it('現在表示中のマーカーの中からmapIdとspotIdによってマーカーを取得する', () => {
        const mapId = 0;
        // (mapId, spotId) = (0, i)のマーカーを作成
        for (let i = 0; i < 5; i++) {
            wrapper.vm.spotMarkers.push(new DefaultSpotMarker([0, 0], mapId, i));
        }
        // 存在しないidを指定した場合
        expect(wrapper.vm.findMarker({mapId: 999, spotId: 999})).toBe(null);
        // 存在するidの場合
        const expectedSpotId = 1;
        const foundMarker = wrapper.vm.findMarker({mapId, spotId: expectedSpotId});
        expect(foundMarker.getIdInfo().mapId).toBe(mapId);
        expect(foundMarker.getIdInfo().spotId).toBe(expectedSpotId);
    });

    it('onMapClickでfocusedSpotを非選択状態にしてSpotInfoを非表示にする', () => {
        const mapId = 0;
        const spotId = 1;
        const marker = new DefaultSpotMarker([0, 0], mapId, spotId);
        marker.setSelected(true);
        mapViewMutations.setFocusedSpot({mapId, spotId});
        // focusedMarkerを探す部分をモック
        wrapper.vm.findMarker = jest.fn((focusedSpot) => {
            return marker;
        });
        wrapper.vm.onMapClick();

        // 非選択状態になっている
        expect((marker as any).isSelected).toBe(false);
        // SpotItemが非表示になっている
        expect(mapViewGetters.spotInfoIsVisible).toBe(false);
    });
});
