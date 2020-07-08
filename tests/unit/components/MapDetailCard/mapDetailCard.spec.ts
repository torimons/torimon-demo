import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { mapViewGetters } from '@/store';
import router from '@/router';
import Vuetify from 'vuetify';
import MapDetailCard from '@/components/MapDetailCard/index.vue';
import Map from '@/Map/Map.ts';


describe.skip('MapDetailCardコンポーネントのテスト', () => {
    let localVue: any;
    let wrapper: any;
    let vuetify: any;
    const testMap: Map = new Map(
        0,
        'testMap',
        {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}},
        undefined,
        'test description');
    beforeEach(() => {
        vuetify = new Vuetify();
        localVue = createLocalVue();
        localVue.use(Vuetify);
        wrapper = shallowMount( MapDetailCard, {
            localVue,
            vuetify,
            router,
            attachToDocument: true,
            propsData: {
                map: testMap,
            },
        });
    });

    afterEach(() => {
        // Map components already initialized防止
        wrapper.destroy();
    });

    it('openMapボタンを押すとrootMapを更新して/MainViewに遷移する', () => {
        wrapper.find('.v-btn.openMap').trigger('click');
        expect(mapViewGetters.rootMap).toBe(testMap);
        expect(wrapper.vm.$route.path).toBe('/MainView');
    });

    it('updateContentで表示内容を更新する', () => {
        const testMap2: Map = new Map(
            0,
            'testMap2',
            {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}},
            undefined,
            'test description2');
        expect(wrapper.vm.name).toBe('testMap');
        expect(wrapper.vm.description).toBe('test description');
        // propの変化をwatchして表示内容を変更する
        wrapper.setProps({ map: testMap2 });
        expect(wrapper.vm.name).toBe('testMap2');
        expect(wrapper.vm.description).toBe('test description2');

    });

    it('closeボタンを押すとcloseDialog', () => {
        wrapper.find('.v-btn.close').trigger('click');
        expect(wrapper.emitted().closeDialog).toBeTruthy();
    });
});
