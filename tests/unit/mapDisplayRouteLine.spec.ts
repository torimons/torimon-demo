import { Component, Vue } from 'vue-property-decorator';
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

    it('displayRouteLinesはgetNodesForNavigationを呼び出し経路を表示する', () => {
        // Vue.nextTick().thenは'_addLayer' of nullのエラー回避
        Vue.nextTick().then(() => {
            // getterが仮作成のためテスト用データはMapViewStateに直接埋め込んでいる物を使用
            const testData: Coordinate[][] = mapViewStore.getNodesForNavigation([]);
            const expectedRouteLines: L.Polyline[] = testData.map((waypoint: Coordinate[]) => (L.polyline(waypoint, {
                color: '#555555',
                weight: 5,
                opacity: 0.7,
            })));
            const actualRouteLines: L.Polyline = wrapper.vm.displayRouteLines(mapViewStore.getNodesForNavigation([]));
            expect(actualRouteLines).toStrictEqual(expectedRouteLines);
        });
    });
});
