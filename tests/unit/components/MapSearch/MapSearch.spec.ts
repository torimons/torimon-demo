import { shallowMount } from '@vue/test-utils';
import MapSearch from '@/components/MapSearch/index.vue';
import SearchBox from '@/components/SearchBox/index.vue';
import MapList from '@/components/MapList/index.vue';

describe('MapSearchコンポーネントのテスト', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = shallowMount(MapSearch, {
            attachToDocument: true,
        });
    });

    afterEach(() => {
        wrapper.destroy();
    });

    it('toggleMapListイベントが発火するとsetMapListIsVisibleが呼ばれる', () => {
        // 初期値はfalse
        expect(wrapper.vm.mapListIsVisible).toBe(false);
        // 子コンポーネント(SearchBox)からのemit
        wrapper.find(SearchBox).vm.$emit('toggleMapList', true);
        // trueに変わっていることを確認
        expect(wrapper.vm.mapListIsVisible).toBe(true);
        // 背景が白になっていることの確認
        expect(wrapper.vm.backgroundColor).toBe('white');
    });

    it('hideMapListイベントが発火するとsetMapListIsVisbleが呼ばれる', () => {
        // hideMapListイベントではMapListを非表示にするため，初期値をtrueにする．
        wrapper.vm.mapListIsVisible = true;
        // 子コンポーネント(MapList)からのemit
        wrapper.find(MapList).vm.$emit('hideMapList', false);
        // falseに変わっていることを確認
        expect(wrapper.vm.mapListIsVisible).toBe(false);
        // 背景が透明になっていることの確認
        expect(wrapper.vm.backgroundColor).toBe('transparent');
    });
});
