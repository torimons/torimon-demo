import { store, mapViewGetters, mapViewMutations } from '@/store/newMapViewIndex.ts';
import { RawMap } from '@/store/types';
import { createLocalVue, mount } from '@vue/test-utils';
import { initMap } from '@/store/modules/NewMapViewModule/MapViewState';
import { GeolocationWrapper } from '@/components/MapView/GeolocationWrapper';
import FloorSwitchButton from '@/components/FloorSwitchButton/newIndex.vue';
import 'leaflet/dist/leaflet.css';
import { cloneDeep } from 'lodash';
import { testRawMapData } from '../../../resources/testRawMapData';
import Vuetify from 'vuetify';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

describe('components/FloorSwitchButton.vue 階層ボタンのテスト', () => {
    let wrapper: any;
    let localVue: any;
    let vuetify: any;
    const testMapData: RawMap[] = cloneDeep(testRawMapData);
    const testRootMap: Map = initMap(testMapData);

    beforeEach(() => {
        vuetify = new Vuetify();
        localVue = createLocalVue();
        localVue.use(Vuetify);
        wrapper = mount(FloorSwitchButton, {
            localVue,
            vuetify,
            attachToDocument: true,
        });
        mapViewMutations.setRootMapForTest(testMapData);
        GeolocationWrapper.watchPosition = jest.fn();
    });

    afterEach(() => {
        // Map components already initialized防止
        wrapper.destroy();
    });

    it('updateLastViewedDetailMapOnClickでlastViewedDetailMapを更新する', () => {
        // updateLastViewedDetailMapOnClickは
        // centerSpotがセットされ、階層ボタンが表示されている必要があるため、
        // centerSpotをセットする。
        const targetSpot = mapViewGetters.rootMap.findSpot(0);
        if (targetSpot === null) {
            throw new Error('Target spot is null.');
        }
        mapViewMutations.setCenterSpotInRootMap(targetSpot);

        // click前（初期値がセットされているので検証）
        const actualMapBeforeClick: Map | undefined = targetSpot.getLastViewedDetailMap();
        if (actualMapBeforeClick === undefined) {
            throw new Error('\'actualMapBeforeClick\' is undefined.');
        }
        const expectedMapIdBeforeClick = 1;
        expect(actualMapBeforeClick.getId()).toBe(expectedMapIdBeforeClick);

        // click操作
        const indexOfClickedButton: number = 0;
        wrapper.vm.updateLastViewedDetailMapOnClick(indexOfClickedButton);

        // click後
        const actualMapAfterClick: Map | undefined = targetSpot.getLastViewedDetailMap();
        if (actualMapAfterClick === undefined) {
            throw new Error('\'actualMapAfterClick\' is undefined.');
        }
        const expectedMapIdAfterClick = 2;
        expect(actualMapAfterClick.getId()).toBe(expectedMapIdAfterClick);
    });

    it('中心付近のスポットの切り替わりに合わせて階層ボタンの内容を切り替える', () => {
        // 中心付近にrootMapの詳細マップ持ちスポットが存在する場合．
        // まだ一度も参照されていないスポットの場合，初期階が選択された状態となる．
        // mapViewMutations.setIdOfCenterSpotInRootMap(0);
        const targetSpotWithDetailMaps = mapViewGetters.rootMap.findSpot(0);
        if (targetSpotWithDetailMaps === null) {
            throw new Error('Target spot is null.');
        }
        mapViewMutations.setCenterSpotInRootMap(targetSpotWithDetailMaps);
        expect(wrapper.vm.floorNames).toEqual(['2F', '1F']);
        expect(wrapper.vm.floorMapIds).toEqual([2, 1]);
        expect(wrapper.vm.selectedFloorButtonIndex).toBe(1);

        // 中心付近にrootMapのスポットが存在するが，詳細マップを持たない場合．
        const targetSpotWithNoDetailMaps = testRootMap.findSpot(1);
        if (targetSpotWithNoDetailMaps === null) {
            throw new Error('Target spot is null.');
        }
        mapViewMutations.setCenterSpotInRootMap(targetSpotWithNoDetailMaps);
        expect(wrapper.vm.floorNames).toEqual([]);
        expect(wrapper.vm.floorMapIds).toEqual([]);
        expect(wrapper.vm.selectedFloorButtonIndex).toBe(undefined);

        // 一度参照したスポットを再度参照する場合．
        // 階層ボタンは最後に参照された階層が選択された状態となる．2階が参照された状態にしてテスト

        // 2Fのマップを選択済みにする
        const targetMap = (testRootMap as any).spots[0].detailMaps[1];
        targetSpotWithDetailMaps.setLastViewedDetailMap(targetMap);

        mapViewMutations.setCenterSpotInRootMap(targetSpotWithDetailMaps);
        expect(wrapper.vm.floorNames).toEqual(['2F', '1F']);
        expect(wrapper.vm.floorMapIds).toEqual([2, 1]);
        expect(wrapper.vm.selectedFloorButtonIndex).toBe(0);

        // 中心付近にrootMapのスポットが存在しない場合．
        mapViewMutations.setNonExistentOfCenterSpotInRootMap();
        expect(wrapper.vm.floorNames).toEqual([]);
        expect(wrapper.vm.floorMapIds).toEqual([]);
        expect(wrapper.vm.selectedFloorButtonIndex).toBe(undefined);
    });

    it('displayLevelに合わせて階層ボタンの表示/非表示を切り替える', () => {
        // displayLevelの初期値はdefaultであるため，先にdetailに切り替えている．
        // displayLevelがdetailのとき
        mapViewMutations.setDisplayLevel('detail');
        expect(wrapper.vm.isVisible).toBe(true);
        // displayLevelがdefaultのとき
        mapViewMutations.setDisplayLevel('default');
        expect(wrapper.vm.isVisible).toBe(false);
    });

    it('階層ボタンがhtml上に表示されているかをチェック', () => {
        // 初期状態では表示されていない
        expect(wrapper.find('.v-btn').exists()).toBe(false);
        // 詳細マップレベルかつ，rootMapに属するスポットが中心に近いとき表示される
        mapViewMutations.setDisplayLevel('detail');
        mapViewMutations.setCenterSpotInRootMap((testRootMap as any).spots[0]);
        expect(wrapper.find('.v-btn').exists()).toBe(true);
    });

});
