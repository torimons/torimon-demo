import { shallowMount } from '@vue/test-utils';
import SpotSearch from '@/components/SpotSearch/index.vue';
import SearchBox from '@/components/SearchBox/index.vue';
import SpotList from '@/components/SpotList/index.vue';
import { mapViewMutations, mapViewGetters } from '@/store';
import SearchSpot from '@/utils/SearchSpot';
import { RawSpot } from '@/store/types';

const spotsForTest: RawSpot[] = [
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

    it('toggleListイベントが発火するとsetSpotListIsVisibleが呼ばれる', () => {
        // 初期値はfalse
        expect(wrapper.vm.spotListIsVisible).toBe(false);
        // 子コンポーネント(SearchBox)からのemit
        wrapper.find(SearchBox).vm.$emit('toggleList', true);
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
        // falseに変わっていることを確認
        expect(wrapper.vm.spotListIsVisible).toBe(false);
        // 背景が透明になっていることの確認
        expect(wrapper.vm.backgroundColor).toBe('transparent');
    });

    it('1つ以上の検索結果がある場合SpotInfoを非表示に, 検索結果がない場合は表示にする', () => {
        // 検索対象の設定
        const targetSpotsForSearch = spotsForTest;
        const searchSpotObj = new SearchSpot(targetSpotsForSearch);
        wrapper.vm.search = searchSpotObj;
        // spotInfoIsVisibleの変更を確認するために最初はtrueをset
        mapViewMutations.setSpotInfoIsVisible(true);
        // 検索結果がある場合は非表示
        wrapper.find(SearchBox).vm.$emit('searchWordInput', 'sougou');
        expect(mapViewGetters.spotInfoIsVisible).toBe(false);
        // focusedSpotが初期値で, 検索結果がない場合は非表示
        wrapper.find(SearchBox).vm.$emit('searchWordInput', 'abcd');
        expect(mapViewGetters.spotInfoIsVisible).toBe(false);
        // focusedSpotが初期値以外で, 検索結果がない場合は表示
        mapViewMutations.setFocusedSpot({mapId: 0, spotId: 1});
        wrapper.find(SearchBox).vm.$emit('searchWordInput', 'bcde');
        expect(mapViewGetters.spotInfoIsVisible).toBe(true);
    });

});
