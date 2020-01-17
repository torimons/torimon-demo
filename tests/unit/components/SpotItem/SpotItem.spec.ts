import {createLocalVue, mount } from '@vue/test-utils';
import SpotItem from '@/components/SpotItem/index.vue';
import Vuetify from 'vuetify';
import { mapViewGetters, mapViewMutations } from '@/store';


describe('SpotItemコンポーネントのテスト', () => {
    let localVue: any;
    let wrapper: any;
    let vuetify: any;

    beforeEach(() => {
        vuetify = new Vuetify();
        localVue = createLocalVue();
        localVue.use(Vuetify);
        wrapper = mount( SpotItem, {
            localVue,
            vuetify,
            attachToDocument: true,
        });
    });

    afterEach(() => {
        wrapper.destroy();
    });

    it('SpotItemがクリックされるとemitし，さらにSpotInfoを表示にする', () => {
        const spotItemCard = wrapper.find('.v-card');
        spotItemCard.trigger('click');
        // emitイベントはhideSpotList
        expect(wrapper.emitted().hideSpotList).toBeTruthy();
        // イベントの数は1回
        expect(wrapper.emitted().hideSpotList.length).toBe(1);
        // emitのpayloadはなし
        expect(wrapper.emitted().hideSpotList[0]).toStrictEqual([]);

        // spotInfoIsVisibleは初期状態でfalseだが，クリックされるとtrueになる
        expect(mapViewGetters.spotInfoIsVisible).toBe(true);
    });
});
