import { mapViewStore } from '@/store/modules/MapViewModule';
import map from '@/components/Map.vue';
import { MapViewState, Coordinate, Node } from '@/store/types';
import { mount, shallowMount } from '@vue/test-utils';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

describe('mapコンポーネントの経路表示', () => {
    let wrapper: any;
    beforeEach(() => {
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
        console.log(wrapper.vm.spotShapeToGeoJson);
        console.log(wrapper.vm.displayRouteLine);
        const actualRouteLine: L.Polyline = wrapper.routeLine;
        expect(actualRouteLine).toStrictEqual(expectedRouteLine);
    });
});
