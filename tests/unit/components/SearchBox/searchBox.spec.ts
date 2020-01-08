import { shallowMount } from '@vue/test-utils';
import SearchBox from '@/components/SearchBox/index.vue';

describe('SearchBoxコンポーネントのテスト', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = shallowMount(SearchBox, {
            attachToDocument: true,
        });
    });

    afterEach(() => {
        // Map components already initialized防止
        wrapper.destroy();
    });

    it('searchWordの変更を監視してonChangeSearchWordを呼び出す', () => {
        wrapper.vm.sendSearchWord = jest.fn();
        wrapper.vm.searchWord = 'abcde';
        // searchWordの中身でsendSearchWordを呼んでいる
        expect(wrapper.vm.sendSearchWord).toHaveBeenCalled();
    });

    it('sendSearchWordを呼び出した時，エミットする', () => {
        wrapper.vm.sendSearchWord();
        // エミットした時，イベントはsearchWordInput
        expect(wrapper.emitted().searchWordInput).toBeTruthy();
        // イベントの数は一回
        expect(wrapper.emitted().searchWordInput.length).toBe(1);

        // エミットのPayLoadは，searchWordになっている
        expect(wrapper.emitted().searchWordInput[0]).toStrictEqual(['']);
    });
});
