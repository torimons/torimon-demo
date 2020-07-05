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

    it('text-fieldをクリックするとフォーカス状態になる', () => {
        // text-fieldのclickイベント発火
        const textField = wrapper.find('input');
        textField.trigger('click');
        expect(wrapper.vm.onFocus).toBe(true);
    });

    it('戻るボタンをクリックした時，フォーカス解除してemitする', () => {
        // 戻るボタンのclickイベント発火
        const btn = wrapper.find('.v-btn#arrow');
        btn.trigger('click');
        // emitした時，イベントはtoggleList
        expect(wrapper.emitted().toggleList).toBeTruthy();
        // イベントの数は一回
        expect(wrapper.emitted().toggleList.length).toBe(1);
        // emitのpayloadはfalse
        expect(wrapper.emitted().toggleList[0]).toStrictEqual([false]);
    });

    it('searchWordの変更を監視してonChangeSearchWordを呼び出す', () => {
        wrapper.vm.sendSearchWord = jest.fn();
        wrapper.vm.searchWord = 'abcde';
        // searchWordの中身でsendSearchWordを呼んでいる
        expect(wrapper.vm.sendSearchWord).toHaveBeenCalled();
    });

    it('sendSearchWordを呼び出した時，エミットする', () => {
        wrapper.vm.sendSearchWord();
        // エミットした時，イベントはsearchWordInput
        expect(wrapper.emitted().searchWordInput).toBeTruthy();
        // イベントの数は一回
        expect(wrapper.emitted().searchWordInput.length).toBe(1);

        // エミットのPayLoadは，searchWordになっている
        expect(wrapper.emitted().searchWordInput[0]).toStrictEqual(['']);
    });
});
