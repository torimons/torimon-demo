import { createLocalVue, mount } from '@vue/test-utils';
import SearchBox from '@/components/SearchBox/index.vue';
import Vuetify from 'vuetify';

describe('SearchBoxコンポーネントのテスト', () => {
    let wrapper: any;
    let localVue: any;
    let vuetify: any;

    beforeEach(() => {
        vuetify = new Vuetify();
        localVue = createLocalVue();
        localVue.use(Vuetify);
        wrapper = mount(SearchBox, {
            localVue,
            vuetify,
            attachToDocument: true,
        });
    });

    afterEach(() => {
        // Map components already initialized防止
        wrapper.destroy();
    });

    it('text-fieldをクリックするとフォーカス状態になり，emitする', () => {
        // text-fieldのclickイベント発火
        const textField = wrapper.find('input');
        textField.trigger('click');
        // emitした時，イベントはtoggleSpotList
        expect(wrapper.emitted().toggleSpotList).toBeTruthy();
        // イベントの数は一回
        expect(wrapper.emitted().toggleSpotList.length).toBe(1);
        // emitのpayloadはtrue
        expect(wrapper.emitted().toggleSpotList[0]).toStrictEqual([true]);
    });

    it('戻るボタンをクリックした時，フォーカス解除してemitする', () => {
        // 戻るボタンのclickイベント発火
        const btn = wrapper.find('.v-btn#arrow');
        btn.trigger('click');
        // emitした時，イベントはtoggleSpotList
        expect(wrapper.emitted().toggleSpotList).toBeTruthy();
        // イベントの数は一回
        expect(wrapper.emitted().toggleSpotList.length).toBe(1);
        // emitのpayloadはfalse
        expect(wrapper.emitted().toggleSpotList[0]).toStrictEqual([false]);
    });
});
