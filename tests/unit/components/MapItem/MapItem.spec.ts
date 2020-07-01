import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import MapItem from '@/components/MapItem/index.vue';
import MapDetailCard from '@/components/MapDetailCard/index.vue';
import Map from '@/Map/Map.ts';

describe('MapItemコンポーネントのテスト', () => {
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
        localVue.use(Vuex);
        localVue.use(Vuetify);
        wrapper = mount( MapItem, {
            localVue,
            vuetify,
            attachToDocument: true,
            propsData: {
                map: testMap,
            },
            stubs: ['router-link'],
        });
    });

    it('MapItemをクリックするとopenMapDetailCardが呼び出されMapDetailCardが表示される', () => {
        // クリック前は非表示
        expect(wrapper.vm.mapDialog.dialog).toBe(false);
        wrapper.find('.v-card').trigger('click');
        // クリック後は表示される
        expect(wrapper.vm.mapDialog.dialog).toBe(true);
    });

    it('MapItemにMapのnameとdescriptionがセットされている', () => {
        expect(wrapper.vm.name).toBe('testMap');
        expect(wrapper.vm.description).toBe('test description');
    });
});
