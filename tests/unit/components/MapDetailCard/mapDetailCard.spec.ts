import { createLocalVue, mount } from '@vue/test-utils';
import MapDetailCard from '@/components/MapDetailCard/index.vue';
import router from '@/router'
import Vuetify from 'vuetify';
import { mapViewGetters } from '@/store';
import Map from '@/Map/Map.ts';


describe('MapDetailCardコンポーネントのテスト', () => {
    let localVue: any;
    let wrapper: any;
    let vuetify: any;
    const testMap: Map = new Map(0, 'testMap', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}});
    beforeEach(() => {
        vuetify = new Vuetify();
        localVue = createLocalVue();
        localVue.use(Vuetify);
        wrapper = mount( MapDetailCard, {
            localVue,
            vuetify,
            router,
            attachToDocument: true,
            propsData: {
                map: testMap,
            }
        });
    });

    it('closeボタンを押すとポップアップが閉じる', () => {
        wrapper.setData({dialog: true});
        expect(wrapper.vm.dialog).toBe(true);
        wrapper.find('.v-dialog').find('.v-btn#close').trigger('click');
        expect(wrapper.vm.dialog).toBe(false);
    });

    it('openMapボタンを押すとrootMapを更新して/MainViewに遷移する', () => {
        wrapper.setData({dialog: true});
        expect(wrapper.vm.dialog).toBe(true);
        wrapper.find('.v-dialog').find('.v-btn#openMap').trigger('click');
        expect(mapViewGetters.rootMap).toBe(testMap);
        expect(wrapper.vm.$route.path).toBe('/MainView');
    });
});
