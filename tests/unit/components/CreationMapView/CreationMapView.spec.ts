import { mapViewMutations } from '@/store';
import { shallowMount } from '@vue/test-utils';
import 'leaflet/dist/leaflet.css';
import { testRawMapData } from '../../../resources/testRawMapData';
import EditorToolBar from '@/components/EditorToolBar';
import CreationMapView from '@/components/CreationMapView';
import Map from '@/Map/Map';


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
