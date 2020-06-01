import { mapViewGetters, mapViewMutations } from '@/store/newMapViewIndex.ts';
import map from '@/components/MapView/index.vue';
import { Coordinate } from '@/store/types';
import { shallowMount } from '@vue/test-utils';
import { testRawMapData } from '../../../resources/testRawMapData';
import { GeolocationWrapper } from '@/components/MapView/GeolocationWrapper';
import Spot from '@/Spot/Spot';

/**
 * モック用の関数，paramに与えた値を返す関数を返す
 * @param c 返して欲しい値
 * @return cを返す関数
 */
function setReturnOfGetCenter(c: Coordinate): (() => {}) {
    return  (jest.fn(() => {
        return c;
    }));
}

describe('中央に最も近いスポットの取得，およびその更新のテスト', () => {
    let wrapper: any;
    beforeEach(() => {
        // テスト用データをstoreにセット
        mapViewMutations.setRootMapForTest(testRawMapData);
        GeolocationWrapper.watchPosition = jest.fn();
        const initMapDisplay = jest.fn();
        const watchStoreForDisplayMap = jest.fn();
        wrapper = shallowMount( map, {
            attachToDocument: true,
            methods: {
                watchStoreForDisplayMap,
                initMapDisplay,
            },
        });
    });

    afterEach(() => {
        // Map components already initialized防止
        wrapper.destroy();
    });

    it('twoPointsIsNearで2点間の遠近を判定する', () => {
        const basePoint: Coordinate = {lat: 33.000000, lng: 130.000000};
        const nearPoint: Coordinate = {lat: 33.000000, lng: 130.002140}; // basePointから約200mの地点
        const farPoint: Coordinate = {lat: 33.000000, lng: 140.002150}; // basePointから約201mの地点
        // 閾値は200(m)でセットしている
        // 2点間の距離が閾値以下の場合
        const expectedValNear: boolean = true;
        const actualValNear: boolean = wrapper.vm.twoPointsIsNear(basePoint, nearPoint);
        expect(actualValNear).toBe(expectedValNear);
        // 2点間の距離が閾値よりも大きい場合
        const expectedValFar: boolean = false;
        const actualValFar: boolean = wrapper.vm.twoPointsIsNear(basePoint, farPoint);
        expect(actualValFar).toBe(expectedValFar);
    });

    it('getNearestSpot()で中央に最も近いスポットを取得する', () => {
        const spots: Spot[] = mapViewGetters.rootMap.getSpots();
        // 中央の座標を設定して中央に最も近いスポットを取得する
        const center1: Coordinate = {lat: 33.595, lng: 130.700};
        const exepctedNearestSpot1: Spot = spots[1];
        const actualSpot1: Spot = wrapper.vm.getNearestSpot(center1, spots);
        expect(actualSpot1).toBe(exepctedNearestSpot1);
        // 別の中央の座標を設定して中央に最も近いスポットを取得する
        const center2: Coordinate = {lat: 33.595, lng: 130.218};
        const exepctedNearestSpot2: Spot = spots[0];
        const actualSpotId2: number = wrapper.vm.getNearestSpot(center2, spots);
        expect(actualSpotId2).toBe(exepctedNearestSpot2);
    });

    it('updateCenterSpotInRootMapで画面中央に近いスポットを更新する', () => {
        // ある一定範囲内にスポットが存在する場合は，画面中央に最も近いスポットをセットする．
        const center1: Coordinate = {lat: 33.595, lng: 130.700};
        wrapper.vm.map.getCenter = setReturnOfGetCenter(center1); // L.Map.getCenter()のモック
        wrapper.vm.updateCenterSpotInRootMap();
        const spots: Spot[] = mapViewGetters.rootMap.getSpots();
        const expectedCenterSpot1: Spot = spots[1];
        const actualCenterSpot1: Spot | null = mapViewGetters.centerSpotInRootMap;
        expect(actualCenterSpot1).toBe(expectedCenterSpot1);

        // 一定範囲内にスポットが存在しない場合はnullをセットする．
        const center2: Coordinate = {lat: 0, lng: 0};
        wrapper.vm.map.getCenter = setReturnOfGetCenter(center2); // L.Map.getCenter()のモック
        wrapper.vm.updateCenterSpotInRootMap();
        const expectedCenterSpot2: null = null;
        const actualCenterSpot2: Spot | null = mapViewGetters.centerSpotInRootMap;
        expect(actualCenterSpot2).toBe(expectedCenterSpot2);
    });

    it('moveイベントでupdateCenterSpotInRootMapが呼び出されているか確認', () => {
        const center: Coordinate = {lat: 33.595, lng: 130.700};
        wrapper.vm.map.getCenter = setReturnOfGetCenter(center);
        wrapper.vm.map.fire('move');
        const spots: Spot[] = mapViewGetters.rootMap.getSpots();
        const expectedCenterSpot: Spot = spots[1];
        const actualCenterSpot: Spot | null = mapViewGetters.centerSpotInRootMap;
        expect(actualCenterSpot).toBe(expectedCenterSpot);
    });
});
