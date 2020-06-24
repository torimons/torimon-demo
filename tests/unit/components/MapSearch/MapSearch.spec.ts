import { shallowMount } from '@vue/test-utils';
import MapSearch from '@/components/MapSearch/index.vue';
import SearchBox from '@/components/SearchBox/index.vue';
import MapList from '@/components/MapList/index.vue';
import axios from 'axios';
import MapDataConverter from '@/utils/MapDataConverter';
import Map from '@/Map/Map.ts';

describe('MapSearchコンポーネントのテスト', () => {
    jest.mock('axios');
    let wrapper: any;
    const res = {
        data: [
            {
                id: 0,
                name: 'testMap0',
                bounds: {
                    topL: {lat: 0, lng: 0},
                    botR: {lat: 0, lng: 0},
                },
            },
            {
                id: 1,
                name: 'testMap1',
                bounds: {
                    topL: {lat: 0, lng: 0},
                    botR: {lat: 0, lng: 0},
                },
            },
        ],
    };
    const targetMaps: Map[] = res.data.map((jsonMap: any) => MapDataConverter.json2tree(jsonMap));

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
    });
});
