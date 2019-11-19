import { mapViewStore } from '@/store/modules/MapViewModule';
import { SpotForMap, Coordinate } from '@/store/types';
import { shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import Map from '@/components/Map.vue';

describe('components/Map.vue マーカー切り替えのテスト', () => {
    beforeEach(() => {
        const event = new Event('testEvent');
    });

    it('switchMarkers イベント発火でマップのマーカーに切り替わる', () => {
        const wrapper: any = shallowMount(Map, {
            attachToDocument: true,
        });
        // イベント発火
        wrapper.trigger('zoomstart');
        // 変更後のマーカーの座標がマップのスポットの座標と一致しているか確認
        /*
        TODO:
        for marker, spot in (wrapper.vm.markers, mapViewStore.map.spots){
            marker.lat == spot.lat && ..
            こんな感じで取得する
        // const lat = mapViewStore.maps[0].spots[0].coordinate[lat];
        // const lng = mapViewStore.maps[0].spots[0].coordinate[lng];
        expect(wrapper.vm.markers).toBe([lat, lng]);
        }
        */
    });

    it('addMarkers スポットの配列を渡してマップにそのスポットのマーカーが追加される', () => {
        // hoge
    });
});
