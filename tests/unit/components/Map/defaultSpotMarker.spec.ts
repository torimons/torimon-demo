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
        const testSpotName = 'testSpot';
        const spotMarker = new DefaultSpotMarker([testLat, testLng], testSpotName, testMapId, testSpotId);
        const expectedMarker = L.marker([testLat, testLng]);
        expect(spotMarker.getLatLng()).toStrictEqual(expectedMarker.getLatLng());
    });

    it('コンストラクタに渡したmapId, spotIdを取得する', () => {
        const expectedMapId = 0;
        const expectedSpotId = 0;
        const testMarker = new DefaultSpotMarker([0, 0], expectedMapId, expectedSpotId);
        expect(testMarker.getIdInfo().mapId).toBe(expectedMapId);
        expect(testMarker.getIdInfo().spotId).toBe(expectedSpotId);
    });

    it('updateFocusedMarkerがmapIdとspotIdをfocusedSpotにsetする', () => {
        const testMarker = new DefaultSpotMarker([0, 0], 'hoge', 0, 1);
        (testMarker as any).updateFocusedMarker();
        const expectedFocusedMarker: {mapId: number, spotId: number} = {mapId: 0, spotId: 1};
        expect(mapViewGetters.focusedSpot).toStrictEqual(expectedFocusedMarker);
    });

    it('updateFocusedMarkerがspotInfoIsVisibleをtrueに変更する', () => {
        const testMarker = new DefaultSpotMarker([0, 0], 'hoge', 0, 0);
        (testMarker as any).updateFocusedMarker();
        expect(mapViewGetters.spotInfoIsVisible).toBe(true);
    });
});
