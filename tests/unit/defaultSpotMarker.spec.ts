import DefaultSpotMarker from '@/components/Map/Marker/DefaultSpotMarker';
import L from 'leaflet';
import map from '@/components/Map/index.vue';
import { mapViewGetters } from '@/store';

describe('DefaultSpotMarkers', () => {
    it('コンストラクタに渡したlatlngが正しくセットされている確認', () => {
        const testLat = 0;
        const testLng = 0;
        const spotMarker = new DefaultSpotMarker([testLat, testLng], {mapId: 0, spotId: 0});
        const expectedMarker = L.marker([testLat, testLng]);
        expect(spotMarker.getLatLng()).toStrictEqual(expectedMarker.getLatLng());
    });

    // クリックイベントが発火できないため、getFocusedMarkerのテストはなし

    it('setFocusedMarkerを呼び出してmapIdとspotIdをfocusedSpotにsetする', () => {
        const testMarker = new DefaultSpotMarker([0, 0], {mapId: 0, spotId: 0});
        const expectedFocusedMarker: {mapId: number, spotId: number} = {mapId: 0, spotId: 1};
        (testMarker as any).setFocusedMarker(expectedFocusedMarker);
        expect(mapViewGetters.focusedSpot).toStrictEqual(expectedFocusedMarker);
    });

    it('setFocusedMarkerがspotInfoIsVisibleを変更する', () => {
        const testMarker = new DefaultSpotMarker([0, 0], {mapId: 0, spotId: 0});
        (testMarker as any).setFocusedMarker();
        expect(mapViewGetters.spotInfoIsVisible).toBe(true);
    });
});
