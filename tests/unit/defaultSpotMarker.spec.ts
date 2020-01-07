import DefaultSpotMarker from '@/components/Map/Marker/DefaultSpotMarker';
import L from 'leaflet';
import map from '@/components/Map/index.vue';
import { mapViewGetters } from '@/store';
import { GeolocationWrapper } from '@/components/Map/GeolocationWrapper';
import { shallowMount } from '@vue/test-utils';

describe('DefaultSpotMarkers', () => {
    let wrapper: any;
    beforeEach(() => {
        // テスト用データをstoreにセット
        GeolocationWrapper.watchPosition = jest.fn();
        wrapper = shallowMount( map, {
            attachToDocument: true,
        });
    });

    afterEach(() => {
        // Map components already initialized防止
        wrapper.destroy();
    });

    it('コンストラクタに渡したlatlngが正しくセットされている確認', () => {
        const testLat = 0;
        const testLng = 0;
        const spotMarker = new DefaultSpotMarker([testLat, testLng], {mapId: 0, spotId: 0});
        const expectedMarker = L.marker([testLat, testLng]);
        expect(spotMarker.getLatLng()).toStrictEqual(expectedMarker.getLatLng());
    });

    it('マーカーをクリックした際にupdateFocusedMarkerがfocusedSpotを変更する', () => {
        // const testMap: L.Map = new L.Map('map');
        const testLat: number = 0;
        const testLng: number = 0;
        const spotMarker = new DefaultSpotMarker([testLat, testLng], {mapId: 1, spotId: 1}).addTo(wrapper.map);
        spotMarker.fire('click')
        expect(mapViewGetters.focusedSpot).toStrictEqual({mapId: 1, spotId: 1});
    });

    it('マーカーをクリックした際にupdateFocusedMarkerがspotInfoIsVisibleを変更する', () => {
        const testLat: number = 0;
        const testLng: number = 0;
        const spotMarker = new DefaultSpotMarker([testLat, testLng], {mapId: 1, spotId: 1});
        expect(mapViewGetters.spotInfoIsVisible).toBe(true);
    });
});
