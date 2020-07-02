import { shallowMount } from '@vue/test-utils';
import MapList from '@/components/MapList/index.vue';
import Map from '@/Map/Map.ts';

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

    it('openMapDetailDialogが呼び出されるとダイアログが表示される', () => {
        const testMap: Map = new Map(
            0,
            'testMap',
            {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}},
            undefined,
            'test description');
        expect(wrapper.vm.dialog).toBe(false);
        wrapper.vm.openMapDetailDialog(testMap);
        expect(wrapper.vm.dialog).toBe(true);
        expect(wrapper.vm.selectedMap).toEqual(testMap);
    });

    it('closeMapDetailDialogが呼び出されるとダイアログを非表示にする', () => {
        wrapper.setData({ dialog: true });
        wrapper.vm.closeMapDetailDialog();
        expect(wrapper.vm.dialog).toBe(false);
    });

});
