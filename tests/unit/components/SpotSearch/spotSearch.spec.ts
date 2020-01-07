import { shallowMount } from '@vue/test-utils';
import SpotSearch from '@/components/SpotSearch/index.vue';

describe('SpotSearchコンポーネントのテスト', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = shallowMount(SpotSearch, {
            attachToDocument: true,
        });
    });

    afterEach(() => {
        // Map components already initialized防止
        wrapper.destroy();
    });

    it('toggleSpotListイベントが発火するとsetSpotListIsVisibleが呼ばれる', () => {
        // イベント発火

        // 関数呼び出し確認
    });
});
