import { mapViewStore } from '@/store/modules/MapViewModule';
import { MapViewState } from '@/store/types';
import { createLocalVue, mount } from '@vue/test-utils';
import { GeolocationWrapper } from '@/components/Map/GeolocationWrapper';
import FloorSwitchButton from '@/components/FloorSwitchButton';
import 'leaflet/dist/leaflet.css';
import { cloneDeep } from 'lodash';
import { testMapViewState } from '../../../resources/testMapViewState';
import Vuetify from 'vuetify';

const mapViewStoreTestData: MapViewState = cloneDeep(testMapViewState);

describe('components/FloorSwitchButton.vue 階層ボタンのテスト', () => {
    let wrapper: any;
    let localVue: any;
    let vuetify: any;

    beforeEach(() => {
        vuetify = new Vuetify();
        localVue = createLocalVue();
        localVue.use(Vuetify);
        wrapper = mount(FloorSwitchButton, {
            localVue,
            vuetify,
            attachToDocument: true,
        });
        const mapViewState = cloneDeep(testMapViewState);
        mapViewStore.setMapViewState(mapViewState);
        GeolocationWrapper.watchPosition = jest.fn();
    });

    afterEach(() => {
        // Map components already initialized防止
        wrapper.destroy();
    });

    it('updateLastViewedDetailMapIdOnClickでlastViewedDetailMapIdを更新する', () => {
        // 中心付近にスポットが存在しない場合
        // ボタンが表示されないため実際に実行される予定はないがテスト
        mapViewStore.setNonExistentOfCenterSpotWithDetailMap();
        wrapper.vm.updateLastViewedDetailMapIdOnClick('1F');
        const actualLastViewedDetailMapIdWithNoSpot: number | null =
            mapViewStore.getLastViewedDetailMapId({
                parentMapId: 0,
                spotId: 0,
            });
        expect(actualLastViewedDetailMapIdWithNoSpot).toBe(null);

        // 中心付近に詳細マップ持ちスポットがある場合
        mapViewStore.setIdOfCenterSpotWithDetailMap(0);
        const floorName: string = '2F';
        wrapper.vm.updateLastViewedDetailMapIdOnClick(floorName);
        const expectedLastViewedDetailMapId: number = 2;
        const actualLastViewedDetailMapId: number | null =
            mapViewStore.getLastViewedDetailMapId({
                parentMapId: 0,
                spotId: 0,
            });
        expect(actualLastViewedDetailMapId).toBe(expectedLastViewedDetailMapId);
    });

    it('中心付近のスポットの切り替わりに合わせて階層ボタンの内容を切り替える', () => {
        // 中心付近にrootMapの詳細マップ持ちスポットが存在する場合．
        // まだ一度も参照されていないスポットの場合，初期階が選択された状態となる．
        mapViewStore.setIdOfCenterSpotWithDetailMap(0);
        expect(wrapper.vm.floorNames).toEqual(['2F', '1F']);
        expect(wrapper.vm.floorMapIds).toEqual([2, 1]);
        expect(wrapper.vm.selectedFloorButtonIndex).toBe(1);
        // 中心付近にrootMapのスポットが存在するが，詳細マップを持たない場合．
        mapViewStore.setIdOfCenterSpotWithDetailMap(1);
        expect(wrapper.vm.floorNames).toEqual([]);
        expect(wrapper.vm.floorMapIds).toEqual([]);
        expect(wrapper.vm.selectedFloorButtonIndex).toBe(undefined);
        // 一度参照したスポットを再度参照する場合．
        // 階層ボタンは最後に参照された階層が選択された状態となる．2階が参照された状態にしてテスト
        const payload = {
            detailMapId: 2,
            parentSpot: {
                parentMapId: 0,
                spotId: 0,
            },
        };
        mapViewStore.setLastViewedDetailMapId(payload);
        mapViewStore.setIdOfCenterSpotWithDetailMap(0);
        expect(wrapper.vm.floorNames).toEqual(['2F', '1F']);
        expect(wrapper.vm.floorMapIds).toEqual([2, 1]);
        expect(wrapper.vm.selectedFloorButtonIndex).toBe(0);

        // 中心付近にrootMapのスポットが存在しない場合．
        mapViewStore.setNonExistentOfCenterSpotWithDetailMap();
        expect(wrapper.vm.floorNames).toEqual([]);
        expect(wrapper.vm.floorMapIds).toEqual([]);
        expect(wrapper.vm.selectedFloorButtonIndex).toBe(undefined);
    });

    it('displayLevelに合わせて階層ボタンの表示/非表示を切り替える', () => {
        // displayLevelの初期値はdefaultであるため，先にdetailに切り替えている．
        // displayLevelがdetailのとき
        mapViewStore.setDisplayLevel('detail');
        expect(wrapper.vm.isVisible).toBe(true);
        // displayLevelがdefaultのとき
        mapViewStore.setDisplayLevel('default');
        expect(wrapper.vm.isVisible).toBe(false);
    });

    it('階層ボタンがhtml上に表示されているかをチェック', () => {
        // 初期状態では表示されていない
        expect(wrapper.find('.v-btn').exists()).toBe(false);
        // 詳細マップレベルかつ，rootMapに属するスポットが中心に近いとき表示される
        mapViewStore.setDisplayLevel('detail');
        mapViewStore.setIdOfCenterSpotWithDetailMap(0);
        expect(wrapper.find('.v-btn').exists()).toBe(true);
    });

});
