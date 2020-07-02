import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import { mapViewGetters, mapViewMutations } from '@/store';
import MapItem from '@/components/MapItem/index.vue';

describe('MapItemコンポーネントのテスト', () => {
    let localVue: any;
    let wrapper: any;
    let vuetify: any;
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
                mapName: 'kyudai',
                userName: 'unknown',
            },
        });
    });

    it.skip('', () => {
        // do nothing
    });
});
