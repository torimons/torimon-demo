import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import SpotInfo from '@/components/SpotInfo/index.vue';
import { mapViewStore } from '@/store/modules/MapViewModule';
import { testMapViewState } from '../../../resources/testMapViewState';
import { cloneDeep } from 'lodash';
import Vuetify from 'vuetify';

describe('SpotInfoコンポーネントのテスト', () => {
    let localVue: any;
    let wrapper: any;
    let vuetify: any;

    beforeEach(() => {
        vuetify = new Vuetify();
        localVue = createLocalVue();
        localVue.use(Vuetify);
        wrapper = mount( SpotInfo, {
            localVue,
            vuetify,
        });
        const mapViewState = cloneDeep(testMapViewState);
        mapViewStore.setMapViewState(mapViewState);
    });

    it('選択されているスポットの切り替えを検知するとコンポーネントの表示内容が変化する(others+descriptionが定義されている場合)', () => {
        const mapId: number = 0;
        const spotId: number = 0;
        mapViewStore.setFocusedSpot({mapId, spotId});
        const expectedSpotName: string = 'SougouGakusyuPlaza';
        const expectedDescription: string = '総合学習プラザです';
        expect(wrapper.vm.spotName).toBe(expectedSpotName);
        expect(wrapper.vm.description).toBe(expectedDescription);
    });

    it('選択されているスポットの切り替えを検知するとコンポーネントの表示内容が変化する(descriptionが定義されていない場合)', () => {
        const mapId: number = 0;
        const spotId: number = 1;
        mapViewStore.setFocusedSpot({mapId, spotId});
        const expectedSpotName: string = 'SougouGakusyuPlaza';
        const expectedDescription: string = '';
        expect(wrapper.vm.spotName).toBe(expectedSpotName);
        expect(wrapper.vm.description).toStrictEqual(expectedDescription);
    });

    it('選択されているスポットの切り替えを検知するとコンポーネントの表示内容が変化する(othersが定義されていない場合)', () => {
        const mapId: number = 1;
        const spotId: number = 0;
        mapViewStore.setFocusedSpot({mapId, spotId});
        const expectedSpotName: string = '101';
        const expectedDescription: string = '';
        expect(wrapper.vm.spotName).toBe(expectedSpotName);
        expect(wrapper.vm.description).toStrictEqual(expectedDescription);
    });

    it('SpotInfoIsVisibleを参照して，コンポーネントの表示/非表示を切り替える', () => {
        // 初期状態では見えない状態
        expect(wrapper.vm.isVisible).toBe(false);
        // spoInfoVisibleが変化すると切り替わる
        mapViewStore.setSpotInfoIsVisible(true);
        expect(wrapper.vm.isVisible).toBe(true);
    });

});
