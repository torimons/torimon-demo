import DefaultSpotMarker from '@/DefaultSpotMarker';
import L, { map } from 'leaflet';

describe('DefaultSpotMarkers', () => {
    it('コンストラクタに渡したlatlngが正しくセットされている確認', () => {
        const testLat = 0;
        const testLng = 0;
        const spotMarker = new DefaultSpotMarker([testLat, testLng]);
        const expectedMarker = L.marker([testLat, testLng]);
        expect(spotMarker.getLatLng()).toStrictEqual(expectedMarker.getLatLng());
    });
});
