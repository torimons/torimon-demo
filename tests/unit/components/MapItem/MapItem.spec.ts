import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import MapItem from '@/components/MapItem/index.vue';
import Map from '@/Map/Map.ts';

describe('MapItemコンポーネントのテスト', () => {
    let localVue: any;
    let wrapper: any;
    let vuetify: any;
    const testMap: Map = new Map(0, 'testMap', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}});
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

    it.skip('MapItemをクリックするとopenMapDetailCardが呼び出されemitを行う', () => {
        wrapper.find('.v-card').trigger('click');
        expect(wrapper.emitted().dialog).toBeTruthy();
        expect(wrapper.emitted().dialog.length).toBe(1);
        expect(wrapper.emitted().dialog[0][0]).toStrictEqual(true);
    });
});
