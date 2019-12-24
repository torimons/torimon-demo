import { mapViewStore } from '@/store/modules/MapViewModule';
import { MapViewState, SpotForMap, Coordinate } from '@/store/types';
import { shallowMount } from '@vue/test-utils';
import { GeolocationWrapper } from '@/components/Map/GeolocationWrapper';
import Vue from 'vue';
import Map from '@/components/Map';
import 'leaflet/dist/leaflet.css';
import L, { map } from 'leaflet';
import { cloneDeep } from 'lodash';
import { testMapViewState } from '../../../resources/testMapViewState';

const mapViewStoreTestData: MapViewState = cloneDeep(testMapViewState);

describe('components/Map.vue マーカー切り替えのテスト', () => {
    let wrapper: any;
    // テストデータ
    const testSpots: SpotForMap[] = [
        {
            id: 0,
            name: 'SougouGakusyuPlaza1',
            coordinate: {
                lat: 33.595502,
                lng: 130.218238,
            },
        },
        {
            id: 1,
            name: 'SougouGakusyuPlaza2',
            coordinate: {
                lat: 33.595503,
                lng: 130.218239,
            },
        },
    ];

    beforeEach(() => {
        mapViewStore.setMapViewState(mapViewStoreTestData);
        GeolocationWrapper.watchPosition = jest.fn();
        wrapper = shallowMount(Map, {
            attachToDocument: true,
        });
    });

    afterEach(() => {
        // Map components already initialized防止
        wrapper.destroy();
    });

    it('replaceMarkersWithに配列を渡してMapのmarkersに登録', () => {
        // コールバック関数は本テストに関係ないため空の関数を渡している
        wrapper.vm.replaceMarkersWith(testSpots);
        const actualMarkers = wrapper.vm.spotMarkers;
        for (let i = 0; i < actualMarkers.length; i++) {
            const testLat: number = testSpots[i].coordinate.lat;
            const testLng: number = testSpots[i].coordinate.lng;
            const actLatLng = actualMarkers[i].getLatLng();
            // testSpotとactualSpotの座標がlatLng型で一致してるか
            expect(actLatLng).toStrictEqual(L.latLng(testLat, testLng));
        }
    });
});
