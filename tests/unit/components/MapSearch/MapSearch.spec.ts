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

    it.skip('', () => {
        // do nothing
    });
});
