import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import { mapViewGetters, mapViewMutations } from '@/store';
import SpotItem from '@/components/SpotItem/index.vue';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

describe('components/SpotItem.vue', () => {
    let localVue: any;
    let wrapper: any;
    let vuetify: any;
    const testSpot: Spot = new Spot(0, 'testSpot', {lat: 0, lng: 0});
    const parentMap: Map = new Map(1, 'parentMap', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}});
    parentMap.addSpot(testSpot);

    beforeEach(() => {
        vuetify = new Vuetify();
        localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(Vuetify);
        wrapper = mount( SpotItem, {
            localVue,
            vuetify,
            attachToDocument: true,
            propsData: {
                spot: testSpot,
                distance: '1km',
            },
        });
    });

    it('SpotList内のSpotItemが選択されるとfocusedSpotの更新をおこなう', () => {
        wrapper.find('.v-card').trigger('click');
        expect(mapViewGetters.focusedSpot).toStrictEqual(testSpot);
    });

    it('親スポットがない場合，スポットの名前と距離が表示される', () => {
        expect(wrapper.find('.v-list-item__title').text()).toBe(testSpot.getName());
        expect(wrapper.find('.v-list-item__subtitle').text()).toBe('1km');
    });

    it('対象スポットの親マップに親スポットが存在する場合' , () => {
        // propsに渡すspotにfloorNameをつけると上の親スポットがないテストでも表示されてしまうので別データ用意
        const testSpotWithFloorName: Spot = new Spot(2, 'testSpotWithFloorName', {lat: 0, lng: 0});
        // Map,Spotを相互登録する際に親マップのfloorNameがspotにセットされる
        const testParentMapWithFloorName: Map =
            new Map(3, 'testParentMapWithFloorName', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}, 'testFloor');
        testParentMapWithFloorName.addSpot(testSpotWithFloorName);
        const parentSpot: Spot = new Spot(4, 'parentSpot', {lat: 0, lng: 0});
        parentSpot.addDetailMaps([testParentMapWithFloorName]);
        // floorNameをもつspotに更新
        wrapper.setProps({
            spot: testSpotWithFloorName,
            distance: '1km',
        });
        expect(wrapper.find('.v-list-item__title').text())
            .toBe(parentSpot.getName() + ' ' + testSpotWithFloorName.getName());
        expect(wrapper.find('.v-list-item__subtitle').text())
            .toBe(testSpotWithFloorName.getFloorName() + ' ' + '1km');
    });
});
