import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog/index.vue';
import Vuetify from 'vuetify';

describe('DeleteConfirmationDialogのテスト', () => {
    let localVue: any;
    let wrapper: any;
    let vuetify: any;

    beforeEach(() => {
        vuetify = new Vuetify();
        localVue = createLocalVue();
        localVue.use(Vuetify);
        wrapper = mount( DeleteConfirmationDialog, {
            localVue,
            vuetify,
        });
    });

    it('propで受け取った文字列を受け取る', () => {
        wrapper.setProps({
            name: 'testName',
        });
        expect(wrapper.vm.$props.name).toBe('testName');
    });

    it('削除ボタンを押すと削除イベントが発火される', () => {
        wrapper.find('.v-btn.delete').trigger('click');
        expect(wrapper.emitted().del).toBeTruthy();
    });

    it('キャンセルボタンを押すとキャンセルイベントが発火される', () => {
        wrapper.find('.v-btn.cancel').trigger('click');
        expect(wrapper.emitted().cancel).toBeTruthy();
    });

});
