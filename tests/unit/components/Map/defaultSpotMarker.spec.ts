import DefaultSpotMarker from '@/components/Map/Marker/DefaultSpotMarker';
import L from 'leaflet';
import map from '@/components/Map/index.vue';
import { mapViewGetters } from '@/store';

describe('DefaultSpotMarkers', () => {
    it('コンストラクタに渡したlatlngが正しくセットされている確認', () => {
        const testLat = 0;
        const testLng = 0;
        const testMapId = 0;
        const testSpotId = 0;
        const spotMarker = new DefaultSpotMarker([testLat, testLng], testMapId, testSpotId);
        const expectedMarker = L.marker([testLat, testLng]);
        expect(spotMarker.getLatLng()).toStrictEqual(expectedMarker.getLatLng());
    });

    it('updateFocusedMarkerがmapIdとspotIdをfocusedSpotにsetする', () => {
        const testMarker = new DefaultSpotMarker([0, 0], 0, 1);
        (testMarker as any).updateFocusedMarker();
        const expectedFocusedMarker: {mapId: number, spotId: number} = {mapId: 0, spotId: 1};
        expect(mapViewGetters.focusedSpot).toStrictEqual(expectedFocusedMarker);
    });

    it('updateFocusedMarkerがspotInfoIsVisibleをtrueに変更する', () => {
        const testMarker = new DefaultSpotMarker([0, 0], 0, 0);
        (testMarker as any).updateFocusedMarker();
        expect(mapViewGetters.spotInfoIsVisible).toBe(true);
    });
});
