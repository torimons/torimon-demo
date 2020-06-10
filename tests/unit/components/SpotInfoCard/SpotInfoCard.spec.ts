import { createLocalVue, mount } from '@vue/test-utils';
import SpotInfoCard from '@/components/SpotInfoCard/index.vue';
import { mapViewGetters, mapViewMutations } from '@/store';
import { initMap } from '@/store/modules/MapViewModule/MapViewState';
import { cloneDeep } from 'lodash';
import Vuetify from 'vuetify';
import { RawMap } from '@/store/types';
import { testRawMapData } from '../../../resources/testRawMapData';
import Spot from '@/Spot/Spot.ts';
import Map from '@/Map/Map.ts';

describe('SpotInfoコンポーネントのテスト', () => {
    let localVue: any;
    let wrapper: any;
    let vuetify: any;

    const testMapData: RawMap[] = cloneDeep(testRawMapData);
    const testRootMap: Map = initMap(testMapData);
    beforeEach(() => {
        vuetify = new Vuetify();
        localVue = createLocalVue();
        localVue.use(Vuetify);
        wrapper = mount( SpotInfoCard, {
            localVue,
            vuetify,
        });
        mapViewMutations.setRootMapForTest(testMapData);
    });

    it('選択されているスポットの切り替えを検知するとコンポーネントの表示内容が変化する(name+descriptionが定義されている場合)', () => {
        // 総合学習プラザ，name + desctiptionあり
        const spot = testRootMap.getSpots()[0];
        mapViewMutations.setFocusedSpot(spot);
        const expectedSpotName: string = spot.getName();
        const expectedDescription: string | undefined = spot.getDescription();
        expect(wrapper.vm.name).toBe(expectedSpotName);
        expect(wrapper.vm.description).toBe(expectedDescription);
    });

    it('選択されているスポットの切り替えを検知するとコンポーネントの表示内容が変化する(descriptionが定義されていない場合)', () => {
        // West2号館, nameあり，descriptionなし
        const spot = testRootMap.getSpots()[1];
        mapViewMutations.setFocusedSpot(spot);
        const expectedSpotName: string = spot.getName();
        // SpotInfoCardコンポーネントでundefの場合空文字を入れている
        const expectedDescription: string = '';
        expect(wrapper.vm.name).toBe(expectedSpotName);
        expect(wrapper.vm.description).toBe(expectedDescription);
    });

    it('SpotInfoIsVisibleを参照して，コンポーネントの表示/非表示を切り替える', () => {
        // 初期状態では見えない状態
        expect(wrapper.vm.isVisible).toBe(false);
        // spoInfoVisibleが変化すると切り替わる
        mapViewMutations.setSpotInfoIsVisible(true);
        expect(wrapper.vm.isVisible).toBe(true);
    });

});
