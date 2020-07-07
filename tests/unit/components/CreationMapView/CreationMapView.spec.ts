import { mapViewMutations } from '@/store';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import 'leaflet/dist/leaflet.css';
import { testRawMapData } from '../../../resources/testRawMapData';
import EditorToolBar from '@/components/EditorToolBar';
import CreationMapView from '@/components/CreationMapView';
import Map from '@/Map/Map';
import Spot from '@/Spot/Spot';
import SpotMarker from '@/components/MapView/Marker/SpotMarker';
import L from 'leaflet';
import SpotEditor from '@/components/SpotEditor';
import Vuetify from 'vuetify';


describe('components/CreationMapView', () => {
    let localVue: any;
    let wrapper: any;
    let vuetify: any;

    beforeEach(() => {
        mapViewMutations.setRootMapForTest(testRawMapData);
        localVue = createLocalVue();
        vuetify = new Vuetify();
        localVue.use(Vuetify);
        wrapper = mount(CreationMapView, {
            localVue,
            vuetify,
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

    it('addSpotにより新しいスポットがmapに追加される.マップの範囲外の場合追加されない', () => {
        const map: Map = wrapper.vm.map;
        map.setBounds({ topL: {lat: 20, lng: 0}, botR: {lat: 0, lng: 20} });
        expect(map.getSpots().length).toBe(0);
        const eventOnOutOfBounds = { latlng: { lat: 50, lng: 50 } };
        wrapper.vm.addSpot(eventOnOutOfBounds);
        expect(map.getSpots().length).toBe(0);

        const event = { latlng: { lat: 10, lng: 10 } };
        wrapper.vm.addSpot(event);
        expect(map.getSpots().length).toBe(1);
    });

    it('switchFocusedMarkerによりフォーカスされるスポットとマーカーが切り替わる', () => {
        const map: Map = wrapper.vm.map;
        // 切り替え前のスポット用意
        const oldFocusedSpot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        map.addSpot(oldFocusedSpot);
        const oldFocusedMarker = new SpotMarker(oldFocusedSpot);
        wrapper.vm.spotMarkers.push(oldFocusedMarker);
        wrapper.vm.focusedSpot = oldFocusedSpot;

        // 切り替え後のスポット用意
        const newFocusedSpot = new Spot(1, 'testSpot', { lat: 0, lng: 0 });
        map.addSpot(newFocusedSpot);
        const newFocusedMarker = new SpotMarker(newFocusedSpot);

        wrapper.vm.switchFocusedMarker(newFocusedMarker);

        const actualFocusedSpot: Spot = wrapper.vm.focusedSpot;
        expect(actualFocusedSpot).toBe(newFocusedSpot);


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
        expect(actualZoomLevel).toBeGreaterThan(wrapper.vm.defaultZoomLevel);
    });

    it('zoomOutによってzoomLevelが小さくなる', () => {
        // ZoomOutボタンのclickイベント発火
        wrapper.find(EditorToolBar).vm.$emit('clickZoomOut');
        const actualZoomLevel: number = wrapper.vm.lMap.getZoom();
        expect(actualZoomLevel).toBeLessThan(wrapper.vm.defaultZoomLevel);
    });

    it('addイベントによってfocusedSpotに詳細マップが追加される', () => {
        const testBounds = {
            topL: {lat: 0, lng: 0},
            botR: {lat: 0, lng: 0},
        };
        const testDetailMap = new Map(0, 'testMap', testBounds);
        const testSpot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        wrapper.setData({focusedSpot: testSpot});

        const focusedSpot: Spot = wrapper.vm.focusedSpot;
        expect(focusedSpot.getDetailMaps().length).toBe(0);
        wrapper.find(SpotEditor).vm.$emit('add');
        expect(focusedSpot.getDetailMaps().length).toBe(1);
    });

    it('duplicateDetailMapで詳細マップを複製', () => {
        const testBounds = {
            topL: {lat: 0, lng: 0},
            botR: {lat: 0, lng: 0},
        };
        const testDetailMap = new Map(0, 'testMap', testBounds);
        const testSpot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });

        wrapper.setData({focusedSpot: testSpot});
        const focusedSpot: Spot = wrapper.vm.focusedSpot;
        expect(focusedSpot.getDetailMaps().length).toBe(0);
        wrapper.find(SpotEditor).vm.$emit('dup', testDetailMap);
        expect(focusedSpot.getDetailMaps().length).toBe(1);
    });

    it('deleteDetailMapで詳細マップを削除', () => {
        const testBounds = {
            topL: {lat: 0, lng: 0},
            botR: {lat: 0, lng: 0},
        };
        const testDetailMap = new Map(0, 'testMap', testBounds);
        const testSpot = new Spot(0, 'testSpot', { lat: 0, lng: 0 });
        wrapper.setData({focusedSpot: testSpot});

        const focusedSpot: Spot = wrapper.vm.focusedSpot;
        focusedSpot.addDetailMaps([testDetailMap]);
        expect(focusedSpot.getDetailMaps().length).toBe(1);
        wrapper.find(SpotEditor).vm.$emit('del', testDetailMap.getId());
        expect(focusedSpot.getDetailMaps().length).toBe(0);
    });

});
