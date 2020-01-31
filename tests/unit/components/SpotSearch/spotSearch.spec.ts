import { shallowMount } from '@vue/test-utils';
import SpotSearch from '@/components/SpotSearch/index.vue';
import SearchBox from '@/components/SearchBox/index.vue';
import SpotList from '@/components/SpotList/index.vue';

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
        // 初期値はfalse
        expect(wrapper.vm.spotListIsVisible).toBe(false);
        // 子コンポーネント(SearchBox)からのemit
        wrapper.find(SearchBox).vm.$emit('toggleSpotList', true);
        // trueに変わっていることを確認
        expect(wrapper.vm.spotListIsVisible).toBe(true);
        // 背景が白になっていることの確認
        expect(wrapper.vm.backgroundColor).toBe('white');
    });

    it('hideSpotListイベントが発火するとsetSpotListIsVisbleが呼ばれる', () => {
        // hideSpotListイベントではSpotListを非表示にするため，初期値をtrueにする．
        wrapper.vm.spotListIsVisible = true;
        // 子コンポーネント(SpotList)からのemit
        wrapper.find(SpotList).vm.$emit('hideSpotList', false);
        expect(wrapper.vm.spotListIsVisible).toBe(false);
        // 背景が透明になっていることの確認
        expect(wrapper.vm.backgroundColor).toBe('transparent');
    });
});
