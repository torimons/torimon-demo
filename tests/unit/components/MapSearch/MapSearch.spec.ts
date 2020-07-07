import { shallowMount } from '@vue/test-utils';
import MapSearch from '@/components/MapSearch/index.vue';
import SearchBox from '@/components/SearchBox/index.vue';
import MapList from '@/components/MapList/index.vue';
import axios from 'axios';
import MapDataConverter from '@/utils/MapDataConverter';
import Map from '@/Map/Map.ts';

describe.skip('MapSearchコンポーネントのテスト', () => {
    jest.mock('axios');
    let wrapper: any;
    const testBounds = {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    };
    const res = {
        data: [
            {
                id: 0,
                name: 'testMap0',
                bounds: testBounds,
            },
            {
                id: 1,
                name: 'testMap1',
                bounds: testBounds,
            },
        ],
    };
    const targetMaps: Map[] = res.data.map((jsonMap: any) => MapDataConverter.json2tree(jsonMap));
    const mockMapSize: number = 5;

    beforeEach(() => {
        (axios.get as any) = jest.fn((url: string) => Promise.resolve(res));
        MapDataConverter.json2tree = jest.fn();
        wrapper = shallowMount(MapSearch, {
            attachToDocument: true,
        });
    });

    afterEach(() => {
        wrapper.destroy();
    });

    it('mounted時apiからデータ取得，取得データ分MapDataConverterで変換を行う', () => {
        // axios.getを呼んでいる
        expect(axios.get).toBeCalled();
        // MapDataConverter.json2treeがデータの数だけ呼ばれている
        expect(MapDataConverter.json2tree).toBeCalledTimes(res.data.length);
        // 全データが表示されている
        expect(wrapper.vm.mapSearchResults.length).toBe(res.data.length + mockMapSize);
        expect(wrapper.vm.getDataSucceeded).toBe(true);
    });

    it('検索文字列が空文字の時，全データが表示されている', () => {
        wrapper.vm.searchWord = '';
        // mockデータも対象なので+5
        expect(wrapper.vm.mapSearchResults.length).toBe(res.data.length + mockMapSize);
        expect(wrapper.vm.getDataSucceeded).toBe(true);
    });

    it('検索文字列が変更された時，検索結果の更新を行う', () => {
        const searchResult: Map[] = [
            new Map(0, 'testMap0', testBounds),
            new Map(1, 'testMap1', testBounds),
        ];
        wrapper.vm.search.search = jest.fn(() => {
            return searchResult;
        });
        wrapper.vm.setSearchWord('testSearchWord');
        expect(wrapper.vm.mapSearchResults).toStrictEqual(searchResult);
    });

    it('api取得が失敗した時getDataSucceededがfalseになっている', () => {
        (axios.get as any) = jest.fn(() => {
            throw new Error('test error');
        });
        wrapper.destroy();
        wrapper = shallowMount(MapSearch, {
            attachToDocument: true,
        });
        expect(wrapper.vm.getDataSucceeded).toBe(false);
    });
});
