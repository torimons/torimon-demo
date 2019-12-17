import { mapViewStore } from '@/store/modules/MapViewModule';
import map from '@/components/Map.vue';
import { MapViewState, Spot, Coordinate } from '@/store/types';
import { shallowMount } from '@vue/test-utils';
import { cloneDeep } from 'lodash';
import { testMapViewState } from '../resources/testMapViewState';
import { GeolocationWrapper } from '@/components/GeolocationWrapper.ts';

const mapViewStateTestData: MapViewState = cloneDeep(testMapViewState);

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

describe('mapコンポーネントのポリゴン表示', () => {
    let wrapper: any;
    beforeEach(() => {
        // テスト用データをstoreにセット
        mapViewStore.setMapViewState(mapViewStateTestData);
        GeolocationWrapper.watchPosition = jest.fn();
        wrapper = shallowMount( map, {
            attachToDocument: true,
        });
    });

    afterEach(() => {
        // Map components already initialized防止
        wrapper.destroy();
    });

    it('twoPointsIsNearで2点間の遠近を判定する', () => {
        const basePoint: Coordinate = {lat: 33.595562, lng: 130.213603};
        const nearPoint: Coordinate = {lat: 33.595510, lng: 130.214806};
        const farPoint: Coordinate = {lat: 40.000000, lng: 140.000000};
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

    it('getNearestSpotId()で中央に最も近いスポットのIdを取得する', () => {
        const spots: Spot[] = mapViewStore.maps[0].spots;
        // 中央の座標を設定して中央に最も近いスポットのIdを取得する
        const center1: Coordinate = {lat: 33.595, lng: 130.700};
        const exepctedNearestSpotId1: number = 1;
        const actualSpotId1: number = wrapper.vm.getNearestSpotId(center1, spots);
        expect(actualSpotId1).toBe(exepctedNearestSpotId1);
        // 別の中央の座標を設定して中央に最も近いスポットのIdを取得する
        const center2: Coordinate = {lat: 33.595, lng: 130.218};
        const exepctedNearestSpotId2: number = 0;
        const actualSpotId2: number = wrapper.vm.getNearestSpotId(center2, spots);
        expect(actualSpotId2).toBe(exepctedNearestSpotId2);
    });

    it('updateIdOfCenterSpotInRootMapで画面中央に近いスポットを更新する', () => {
        // ある一定範囲内にスポットが存在する場合は，画面中央に最も近いスポットのIdをセットする．
        const center1: Coordinate = {lat: 33.595, lng: 130.700};
        wrapper.vm.map.getCenter = setReturnOfGetCenter(center1);
        wrapper.vm.updateIdOfCenterSpotInRootMap();
        const expectedCenterSpotId1: number = 1;
        const actualCenterSpotId1: number | null = mapViewStore.IdOfCenterSpotInRootMap;
        expect(actualCenterSpotId1).toBe(expectedCenterSpotId1);

        // 一定範囲内にスポットが存在しない場合はnullをセットする．
        const center2: Coordinate = {lat: 0, lng: 0};
        wrapper.vm.map.getCenter = setReturnOfGetCenter(center2);
        wrapper.vm.updateIdOfCenterSpotInRootMap();
        const expectedCenterSpotId2: null = null;
        const actualCenterSpotId2: number | null = mapViewStore.IdOfCenterSpotInRootMap;
        expect(actualCenterSpotId2).toBe(expectedCenterSpotId2);
    });

    it('moveイベントでupdateIdOfCenterSpotInRootMapが呼び出されているか確認', () => {
        const center: Coordinate = {lat: 33.595, lng: 130.700};
        wrapper.vm.map.getCenter = setReturnOfGetCenter(center);
        wrapper.vm.map.fire('move');
        const expectedCenterSpotId: number = 1;
        const actualCenterSpotId: number | null = mapViewStore.IdOfCenterSpotInRootMap;
        expect(actualCenterSpotId).toBe(expectedCenterSpotId);
    });
});
