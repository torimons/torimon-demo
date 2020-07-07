import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import DetailMapManageList from '@/components/DetailMapManageList';
import Vuetify from 'vuetify';
import Map from '@/Map/Map.ts';

describe('DetailMapManageListのテスト', () => {
    let localVue: any;
    let wrapper: any;
    let vuetify: any;

    /*
      AVOID BELOW WARNING
      console.warn node_modules/vuetify/dist/vuetify.js:42574
      [Vuetify] Unable to locate target [data-app]

      link
      - https://www.tutorialfor.com/questions-135624.htm
    */
    const app = document.createElement('div');
    app.setAttribute('data-app', (true as any));
    document.body.append (app);

    beforeEach(() => {
        vuetify = new Vuetify();
        localVue = createLocalVue();
        localVue.use(Vuetify);
        wrapper = mount( DetailMapManageList, {
            localVue,
            vuetify,
        });
    });

    it('複製ボタンが押されると詳細マップ複製のイベントがemitされる', () => {
        const testBounds = {
            topL: {lat: 0, lng: 0},
            botR: {lat: 0, lng: 0},
        };
        const testDetailMap = new Map(0, 'testMap', testBounds);
        wrapper.vm.duplicateMap(testDetailMap);
        expect(wrapper.emitted().dup).toBeTruthy();
    });

    it('削除ボタンが押されると削除確認ダイアログを表示する', () => {
        const testBounds = {
            topL: {lat: 0, lng: 0},
            botR: {lat: 0, lng: 0},
        };
        const testDetailMap = new Map(0, 'testMap', testBounds);
        // ダイアログは最初非表示
        expect(wrapper.vm.dialog).toBe(false);
        wrapper.vm.confirmMapDeletion(testDetailMap);
        // 確認時にダイアログを表示
        expect(wrapper.vm.dialog).toBe(true);
        expect(wrapper.vm.selectedMap).toEqual(testDetailMap);
    });

    it('deleteMapが呼ばれると削除イベントをemitする', () => {
        const testBounds = {
            topL: {lat: 0, lng: 0},
            botR: {lat: 0, lng: 0},
        };
        const testDetailMap = new Map(0, 'testMap', testBounds);
        wrapper.vm.selectedMap = testDetailMap;
        wrapper.vm.deleteMap();
        expect(wrapper.emitted().del[0][0]).toBe(testDetailMap.getId());
    });

    it('削除確認ダイアログでキャンセルボタンが押されるとダイアログを閉じる', () => {
        // ダイアログ表示/非表示のテストが上手くいかなかったため、
        // とりあえず表示/非表示の変数を確認
        wrapper.vm.dialog = true;
        wrapper.vm.cancelMapDeletion();
        expect(wrapper.vm.dialog).toBe(false);
    });

});
