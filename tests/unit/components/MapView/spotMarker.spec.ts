import SpotMarker from '@/components/MapView/Marker/SpotMarker';
import L from 'leaflet';
import { mapViewGetters, mapViewMutations } from '@/store';
import Spot from '@/Spot/Spot';

describe('SpotMarkers', () => {
    it('コンストラクタに渡したlatlngが正しくセットされている確認', () => {
        const testLat = 0;
        const testLng = 0;
        const testSpot: Spot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        const spotMarker = new SpotMarker(testSpot);
        const expectedMarker = L.marker([testLat, testLng]);
        expect(spotMarker.getLatLng()).toStrictEqual(expectedMarker.getLatLng());
    });

    it('コンストラクタに渡したスポットを取得する', () => {
        const testSpot: Spot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        const testMarker = new SpotMarker(testSpot);
        const expectedSpot: Spot = testSpot;
        expect(testMarker.getSpot()).toBe(expectedSpot);
    });

    it('コンストラクタに渡したスポットがfocusedSpotの場合setSelected(true)が呼ばれる', () => {
        const testSpot: Spot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        mapViewMutations.setFocusedSpot(testSpot);
        const testMarker = new SpotMarker(testSpot);
        const selectedColor: string = '#AE56B3';
        const htmlTemplate =
            `<div class="marker-pin"></div><i class="material-icons" style="font-size:48px; color:${selectedColor};">place</i>`;
        const expectedIcon = L.divIcon({
            className: 'custom-div-icon',
            html: htmlTemplate,
            iconAnchor: [24, 50],
        });
        expect(testMarker.getIcon()).toStrictEqual(expectedIcon);
    });

    it('updateFocusedMarkerがspotをfocusedSpotにsetする', () => {
        const testSpot: Spot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        const testMarker = new SpotMarker(testSpot);
        (testMarker as any).updateFocusedMarker();
        const expectedSpot: Spot = testSpot;
        expect(mapViewGetters.focusedSpot).toBe(expectedSpot);
    });

    it('updateFocusedMarkerがspotInfoIsVisibleをtrueに変更する', () => {
        const testSpot: Spot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        const testMarker = new SpotMarker(testSpot);
        (testMarker as any).updateFocusedMarker();
        expect(mapViewGetters.spotInfoIsVisible).toBe(true);
    });
});
