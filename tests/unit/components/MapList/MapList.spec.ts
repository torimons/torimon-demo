import { shallowMount } from '@vue/test-utils';
import MapList from '@/components/MapList/index.vue';

describe('MapListコンポーネントのテスト', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = shallowMount(MapList, {
            attachToDocument: true,
        });
    });

    afterEach(() => {
        wrapper.destroy();
    });

    it('MapItemからemitされたものをMapSearchへemit', () => {
        // MapItemからのemit
        wrapper.vm.$emit('dialog', true);
        // MapSearchへemit
        expect(wrapper.emitted().dialog).toBeTruthy();
        expect(wrapper.emitted().dialog.length).toBe(1);
        expect(wrapper.emitted().dialog[0][0]).toStrictEqual(true);
    });
});
