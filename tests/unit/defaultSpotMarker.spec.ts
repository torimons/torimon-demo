import DefaultSpotMarker from '@/components/Map/Marker/DefaultSpotMarker';
import L, { map } from 'leaflet';

describe('DefaultSpotMarkers', () => {
    it('コンストラクタに渡したlatlngが正しくセットされている確認', () => {
        const testLat = 0;
        const testLng = 0;
        const spotMarker = new DefaultSpotMarker([testLat, testLng], { mapId: 0, spotId: 0 });
        const expectedMarker = L.marker([testLat, testLng]);
        expect(spotMarker.getLatLng()).toStrictEqual(expectedMarker.getLatLng());
    });

    it('マーカーをクリックした際にuodateFocusedMarkerがfocusedSpotを変更する', () => {
        // テスト内容
    });

    it('マーカーをクリックした際にuodateFocusedMarkerがspotInfoIsVisibleを変更する', () => {
        // テスト内容
    });
});
