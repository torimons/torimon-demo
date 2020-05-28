import DefaultSpotMarker from '@/components/MapView/Marker/DefaultSpotMarker';
import L from 'leaflet';
import { mapViewGetters } from '@/store/newMapViewIndex.ts';
import Spot from '@/Spot/Spot';

describe('DefaultSpotMarkers', () => {
    it('コンストラクタに渡したlatlngが正しくセットされている確認', () => {
        const testLat = 0;
        const testLng = 0;
        const testSpot: Spot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        const testSpotName = 'testSpot';
        const spotMarker = new DefaultSpotMarker([testLat, testLng], testSpotName, testSpot);
        const expectedMarker = L.marker([testLat, testLng]);
        expect(spotMarker.getLatLng()).toStrictEqual(expectedMarker.getLatLng());
    });

    it('コンストラクタに渡したスポットを取得する', () => {
        const testSpot: Spot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        const testMarker = new DefaultSpotMarker([0, 0], 'testSoptName', testSpot);
        const expectedSpot: Spot = testSpot;
        expect(testMarker.getSpot()).toBe(expectedSpot);
    });

    it('updateFocusedMarkerがspotをfocusedSpotにsetする', () => {
        const testSpot: Spot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        const testMarker = new DefaultSpotMarker([0, 0], 'hoge', testSpot);
        (testMarker as any).updateFocusedMarker();
        const expectedFocusedMarker: {mapId: number, spotId: number} = {mapId: 0, spotId: 1};
        const expectedSpot: Spot = testSpot;
        expect(mapViewGetters.focusedSpot).toBe(expectedSpot);
    });

    it('updateFocusedMarkerがspotInfoIsVisibleをtrueに変更する', () => {
        const testSpot: Spot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        const testMarker = new DefaultSpotMarker([0, 0], 'hoge', testSpot);
        (testMarker as any).updateFocusedMarker();
        expect(mapViewGetters.spotInfoIsVisible).toBe(true);
    });
});
