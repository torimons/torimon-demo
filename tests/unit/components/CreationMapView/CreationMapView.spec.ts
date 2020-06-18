import { mapViewGetters, mapViewMutations } from '@/store';
import { shallowMount } from '@vue/test-utils';
import { GeolocationWrapper } from '@/components/MapView/GeolocationWrapper';
import MapView from '@/components/MapView/index.vue';
import 'leaflet/dist/leaflet.css';
import { testRawMapData } from '../../../resources/testRawMapData';
import { SpotType } from '@/store/types';
import EditorToolBar from '@/components/EditorToolBar';
import CreationMapView from '@/components/CreationMapView';


describe('components/CreationMapView/index.vue zoomlevel切り替えのテスト', () => {
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

    it('setAddSpotMethodOnMapClickのテスト', () => {
        
    });

    it('addSpotのテスト', () => {
        
    });

    it('zoomInによってzoomLevelが大きくなる', () => {
        //ZoomInボタンのclickイベント発火
        wrapper.find(EditorToolBar).vm.$emit('clickZoomIn');
        const actualZoomLevel: number = wrapper.vm.lMap.getZoom();
        expect(actualZoomLevel).toBeGreaterThan(17);
    });

    it('zoomOutによってzoomLevelが小さくなる', () => {
        //ZoomOutボタンのclickイベント発火
        wrapper.find(EditorToolBar).vm.$emit('clickZoomOut');
        const actualZoomLevel: number = wrapper.vm.lMap.getZoom();
        expect(actualZoomLevel).toBeLessThan(17);
    });
});