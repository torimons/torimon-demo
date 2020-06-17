import { shallowMount } from '@vue/test-utils';
import { GeolocationWrapper } from '@/components/MapView/GeolocationWrapper';
import MapView from '@/components/MapView';
import 'leaflet/dist/leaflet.css';
import L, { map } from 'leaflet';
import Spot from '@/Spot/Spot';


describe('components/Map.vue マーカー切り替えのテスト', () => {
    let wrapper: any;

    beforeEach(() => {
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

    it('displaySpotMarkersにspotの配列を渡してMapのspotMarkersに登録', () => {
        const testSpots: Spot[] = [
            new Spot(0, 'testSpot0', { lat: 0, lng: 0 }),
            new Spot(1, 'testSpot1', { lat: 0, lng: 0 }),
        ];
        wrapper.vm.displaySpotMarkers(testSpots);
        const actualMarkers: L.Marker[] = wrapper.vm.spotMarkers;
        for (let i = 0; i < actualMarkers.length; i++) {
            const testLat: number = testSpots[i].getCoordinate().lat;
            const testLng: number = testSpots[i].getCoordinate().lng;
            const actLatLng: L.LatLng = actualMarkers[i].getLatLng();
            // testSpotとactualSpotの座標がlatLng型で一致してるか
            expect(actLatLng).toStrictEqual(L.latLng(testLat, testLng));
        }
    });
});
