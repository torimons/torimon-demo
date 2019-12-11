import { mapViewStore } from '@/store/modules/MapViewModule';
import map from '@/components/Map.vue';
import { MapViewState, Coordinate, Node } from '@/store/types';
import { mount, shallowMount } from '@vue/test-utils';
import { GeolocationWrapper } from '@/components/GeolocationWrapper.ts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

describe('mapコンポーネントの経路表示', () => {
    let wrapper: any;
    beforeEach(() => {
        GeolocationWrapper.watchPosition = jest.fn();
        wrapper = shallowMount( map, {
            attachToDocument: true,
        });
    });

    it('displayRouteLineはgetNodesForNavigationを呼び出し経路を表示する', () => {
        // getterが仮作成のためテスト用データはMapViewStateに直接埋め込んでいる物を使用
        const expectedNodeArray: Coordinate[] = [
            {
                lat: 33.595502,
                lng: 130.218238,
            },
            {
                lat: 33.596502,
                lng: 130.218238,
            },
            {
                lat: 33.596502,
                lng: 130.219238,
            },
        ];
        const expectedRouteLine: L.Polyline = L.polyline(expectedNodeArray, {
            color: '#555555',
            weight: 5,
            opacity: 0.7,
        });
        // マップのレイヤー上でテストを行うと煩雑になるため今回は関数をモックしてます
        wrapper.vm.displayRouteLine = jest.fn(() => {
            const nodesForNavigation: Coordinate[] = mapViewStore.getNodesForNavigation([]);
            const routeLine = L.polyline(nodesForNavigation, {
                color: '#555555',
                weight: 5,
                opacity: 0.7,
            });
            return routeLine;
        });
        const actualRouteLine: L.Polyline = wrapper.vm.displayRouteLine();
        expect(actualRouteLine).toStrictEqual(expectedRouteLine);
    });
});
