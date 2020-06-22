import { mapViewMutations } from '@/store';
import { shallowMount } from '@vue/test-utils';
import 'leaflet/dist/leaflet.css';
import { testRawMapData } from '../../../resources/testRawMapData';
import EditorToolBar from '@/components/EditorToolBar';
import CreationMapView from '@/components/CreationMapView';
import Map from '@/Map/Map';
import Spot from '@/Spot/Spot';
import SpotMarker from '@/components/MapView/Marker/SpotMarker';
import L from 'leaflet';


describe('components/CreationMapView', () => {
    let wrapper: any;

    beforeEach(() => {
        mapViewMutations.setRootMapForTest(testRawMapData);
        wrapper = shallowMount(CreationMapView, {
            attachToDocument: true,
        });
    });

    afterEach(() => {
        // Map components already initialized防止
        wrapper.destroy();
    });

    it('setAddSpotMethodOnMapClickによってonMapClickにaddSpot関数が代入される', () => {
        const mockedAddSpot = jest.fn();
        wrapper.vm.addSpot = mockedAddSpot;
        wrapper.vm.setAddSpotMethodOnMapClick('default');
        wrapper.vm.onMapClick();
        expect(mockedAddSpot.mock.calls.length).toBe(1);
    });

    it('setAddSpotMethodOnMapClickに渡した引数がspotTypeToAddNextフィールドにセットされる', () => {
        wrapper.vm.setAddSpotMethodOnMapClick('restroom');
        expect(wrapper.vm.spotTypeToAddNext).toBe('restroom');
    });

    it('addSpotにより新しいスポットがmapに追加される', () => {
        const map: Map = wrapper.vm.map;
        expect(map.getSpots().length).toBe(0);
        const e = { latlng: { lat: 0, lng: 0 } };
        wrapper.vm.addSpot(e);
        expect(map.getSpots().length).toBe(1);
    });

    it('switchFocusedMarkerによりフォーカスされるスポットとマーカーが切り替わり，スポットエディターが現れる', () => {
        const map: Map = wrapper.vm.map;
        // 切り替え前のスポット用意
        const oldFocusedSpot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        map.addSpot(oldFocusedSpot);
        const oldFocusedMarker = new SpotMarker(oldFocusedSpot);
        wrapper.vm.spotMarkers.push(oldFocusedMarker);
        wrapper.vm.focusedSpot = oldFocusedSpot;
        wrapper.vm.spotEditorIsVisible = false;

        // 切り替え後のスポット用意
        const newFocusedSpot = new Spot(1, 'testSpot', { lat: 0, lng: 0 });
        map.addSpot(newFocusedSpot);
        const newFocusedMarker = new SpotMarker(newFocusedSpot);

        wrapper.vm.switchFocusedMarker(newFocusedMarker);

        const actualFocusedSpot: Spot = wrapper.vm.focusedSpot;
        expect(actualFocusedSpot).toBe(newFocusedSpot);

        const actualSpotEditorIsVisibile: boolean = wrapper.vm.spotEditorIsVisible;
        expect(actualSpotEditorIsVisibile).toBe(true);

        // 以下アイコンの色切り替わりテスト
        const actualOldSpotMarkerIcon: L.DivIcon = (oldFocusedMarker as any).getIcon();
        const actualNewSpotMarkerIcon: L.DivIcon = (newFocusedMarker as any).getIcon();
        //  期待値用のアイコン作成関数
        const createIcon = (isSelected: boolean): L.DivIcon => {
            const normalColor: string = '#3F8373';
            const selectedColor: string = '#AE56B3';
            const color = isSelected ? selectedColor : normalColor;
            const htmlTemplate =
                `<div class="marker-pin"></div><i class="material-icons" style="font-size:48px; color:${color};">place</i>`;
            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: htmlTemplate,
                iconAnchor: [24, 50],
            });
            return icon;
        };
        const expectedNomarlIcon = createIcon(false);
        const expectedSelectedIcon = createIcon(true);
        expect(actualOldSpotMarkerIcon).toEqual(expectedNomarlIcon);
        expect(actualNewSpotMarkerIcon).toEqual(expectedSelectedIcon);
    });

    it('deleteFocusedMarkerによりfocusedSpotがmapの子スポットから消え，マーカーも地図上から消える', () => {
        const map: Map = wrapper.vm.map;
        const testSpot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        map.addSpot(testSpot);
        const testMarker = new SpotMarker(testSpot);
        wrapper.vm.spotMarkers.push(testMarker);
        wrapper.vm.focusedSpot = testSpot;
        wrapper.vm.deleteFocusedSpot();

        const acutualSpots: Spot[] = map.getSpots();
        expect(acutualSpots).not.toContain(testSpot);
        const acutualMarkers: SpotMarker[] = wrapper.vm.spotMarkers;
        expect(acutualMarkers).not.toContain(testMarker);
    });

    it('zoomInによってzoomLevelが大きくなる', () => {
        // ZoomInボタンのclickイベント発火
        wrapper.find(EditorToolBar).vm.$emit('clickZoomIn');
        const actualZoomLevel: number = wrapper.vm.lMap.getZoom();
        expect(actualZoomLevel).toBeGreaterThan(17);
    });

    it('zoomOutによってzoomLevelが小さくなる', () => {
        // ZoomOutボタンのclickイベント発火
        wrapper.find(EditorToolBar).vm.$emit('clickZoomOut');
        const actualZoomLevel: number = wrapper.vm.lMap.getZoom();
        expect(actualZoomLevel).toBeLessThan(17);
    });
});
