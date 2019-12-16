import { mapViewStore } from '@/store/modules/MapViewModule';
import map from '@/components/Map.vue';
import { MapViewState, Spot } from '@/store/types';
import { shallowMount } from '@vue/test-utils';
import { cloneDeep } from 'lodash';
import { testMapViewState } from '../resources/testMapViewState';
import { GeolocationWrapper } from '@/components/GeolocationWrapper.ts';

const mapViewStateTestData: MapViewState = cloneDeep(testMapViewState);



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

    it('getNearestSpotId()で中央に最も近いスポットのIdを取得する', () => {
        const spots: Spot[] = mapViewStore.maps[0].spots;

        // 中央の座標を設定して中央に最も近いスポットのIdを取得する
        const center1 = {lat: 33.6, lng: 130.71} as L.LatLng;
        const exepctedNearestSpotId1: number = 1;
        const actualSpotId1: number = wrapper.vm.getNearestSpotId(center1, spots);
        expect(actualSpotId1).toBe(exepctedNearestSpotId1);

        // 別の中央の座標を設定して中央に最も近いスポットのIdを取得する
        const center2 = {lat: 33.6, lng: 130.21} as L.LatLng;
        const exepctedNearestSpotId2 = 0;
        const actualSpotId2: number = wrapper.vm.getNearestSpotId(center2, spots);
        expect(actualSpotId2).toBe(exepctedNearestSpotId2);
    });

});
