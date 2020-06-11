import { shallowMount } from '@vue/test-utils';
import MapList from '@/components/MapList/index.vue';
import { RawMap } from '@/store/types';

// 現状MapListはEmitの作業しか行っておらずEmitのテストはMapSearchにて行っている為,テストはありません
// その後の機能追加にてテストが発生する可能性がある
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

    it.skip('', () => {
        // do nothing
    });
});
