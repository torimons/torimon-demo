import { Component, Vue } from 'vue-property-decorator';
import { mapViewStore } from '@/store/modules/MapViewModule';
import map from '@/components/Map.vue';
import { MapViewState, Coordinate, Node } from '@/store/types';
import { mount, shallowMount } from '@vue/test-utils';
import { GeolocationWrapper } from '@/components/GeolocationWrapper.ts';
import L, { LatLng } from 'leaflet';

describe('mapコンポーネントの経路表示', () => {
    let wrapper: any;
    beforeEach(() => {
        GeolocationWrapper.watchPosition = jest.fn();
        wrapper = shallowMount( map, {
            attachToDocument: true,
        });
    });

    // 
    it('displayRouteLinesはgetNodesForNavigationを呼び出し経路を表示する', () => {
        // '_addLayer' of nullのエラー回避のためaddRouteToMapをmock
        wrapper.vm.addRouteToMap = jest.fn();
        // getterが仮作成のためテスト用データはMapViewStateに直接埋め込んでいる物を使用
        const testData: Coordinate[][] = mapViewStore.getNodesForNavigation([]);
        const expectedRouteLines: L.Polyline[] = testData.map((waypoint: Coordinate[]) => (L.polyline(waypoint, {
            color: '#555555',
            weight: 5,
            opacity: 0.7,
        })));
        wrapper.vm.displayRouteLines(testData);
        const actualRouteLines: L.Polyline[] = wrapper.vm.routeLines;
        // LatLngsに対してのテスト
        const expectedLatlngs: (LatLng[] | LatLng[][] | LatLng[][][])[] = expectedRouteLines.map((expectedRouteLine: L.Polyline) => expectedRouteLine.getLatLngs());
        const actualLatlngs: (LatLng[] | LatLng[][] | LatLng[][][])[] = actualRouteLines.map((actualRouteLine: L.Polyline) => actualRouteLine.getLatLngs());
        expect(actualLatlngs).toStrictEqual(expectedLatlngs);
        // optionsに対してのテスト
        const expectedOptions = expectedRouteLines.map((expectedRouteLine: L.Polyline) => expectedRouteLine.options);
        const actualOptions = actualRouteLines.map((actualRouteLine: L.Polyline) => actualRouteLine.options);
        expect(actualOptions).toStrictEqual(expectedOptions);
    });
});
