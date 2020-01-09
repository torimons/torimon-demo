import { shallowMount } from '@vue/test-utils';
import SpotSearch from '@/components/SpotSearch/index.vue';
import SearchBox from '@/components/SearchBox/index.vue';

describe('SpotSearchコンポーネントのテスト', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = shallowMount(SpotSearch, {
            attachToDocument: true,
        });
    });

    afterEach(() => {
        wrapper.destroy();
    });

    it('toggleSpotListイベントが発火するとsetSpotListIsVisibleが呼ばれる', () => {
        // これは単体テストなのか...?
        // 初期値はfalse
        expect(wrapper.vm.spotListIsVisible).toBe(false);
        // 子コンポーネントからのemit
        wrapper.find(SearchBox).vm.$emit('toggleSpotList', true);
        // trueに変わっていることを確認
        expect(wrapper.vm.spotListIsVisible).toBe(true);
    });
});
