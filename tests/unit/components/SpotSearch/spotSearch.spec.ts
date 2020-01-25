import { shallowMount } from '@vue/test-utils';
import SpotSearch from '@/components/SpotSearch/index.vue';
import SearchBox from '@/components/SearchBox/index.vue';
import SpotList from '@/components/SpotList/index.vue';
import { mapViewMutations, mapViewGetters } from '@/store';
import Search from '@/utils/Search';
import { Spot } from '@/store/types';

const spotsForTest: Spot[] = [
    {
        mapId: 0,
        id: 0,
        name: 'SougouGakusyuPlaza',
        coordinate: {
            lat: 33.595502,
            lng: 130.218238,
        },
        shape: {
            type: 'Polygon',
            coordinates: [[[]]],
        },
        gateNodeIds: [],
        detailMapIds: [1, 2],
        detailMapLevelNames: ['1F', '2F'],
        lastViewedDetailMapId: null,
    },
    {
        mapId: 0,
        id: 1,
        name: 'SpotForTest',
        coordinate: {
            lat: 33.595502,
            lng: 130.218238,
        },
        shape: {
            type: 'Polygon',
            coordinates: [[[]]],
        },
        gateNodeIds: [],
        detailMapIds: [],
        detailMapLevelNames: [],
        lastViewedDetailMapId: null,
    },
];

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
    });

    it('hideSpotListイベントが発火するとsetSpotListIsVisbleが呼ばれる', () => {
        // hideSpotListイベントではSpotListを非表示にするため，初期値をtrueにする．
        wrapper.vm.spotListIsVisible = true;
        // 子コンポーネント(SpotList)からのemit
        wrapper.find(SpotList).vm.$emit('hideSpotList', false);
        // falseに変わっていることを確認
        expect(wrapper.vm.spotListIsVisible).toBe(false);
    });

    it('検索ボックスに1つ以上の検索結果が表示されるとSpotInfoを非表示に, 検索結果が空になると表示にする', () => {
        // 検索対象の設定
        const targetSpotsForSearch = spotsForTest;
        const searchObj = new Search(targetSpotsForSearch);
        wrapper.vm.search = searchObj;
        // spotInfoIsVisibleの変更を確認するために最初はfalseをset
        mapViewMutations.setSpotInfoIsVisible(true);
        // 検索結果がある場合
        wrapper.find(SearchBox).vm.$emit('searchWordInput', 'sougou');
        // spotInfoIsVisibleはfalse
        expect(mapViewGetters.spotInfoIsVisible).toBe(false);
        // 検索結果がない場合
        wrapper.find(SearchBox).vm.$emit('searchWordInput', 'abcde');
        // spotInfoIsVisibleはture
        expect(mapViewGetters.spotInfoIsVisible).toBe(true);
    });

});
