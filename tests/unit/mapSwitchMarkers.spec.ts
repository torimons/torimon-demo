import { mapViewStore } from '@/store/modules/MapViewModule';
import { SpotForMap, Coordinate } from '@/store/types';
import { shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import Map from '@/components/Map.vue';

describe('components/Map.vue マーカー切り替えのテスト', () => {
    beforeEach(() => {
        const event = new Event('testEvent');
    });

    it('switchMarkerが呼ばれるとマーカーが切り替わる', () => {
        const wrapper = shallowMount(Map, /*{
            propsData: { propmap, ...} 
        }*/);
        console.log(wrapper);
        //expect(wrapper.vm.markers).toBe([L.marker([wrapper.vm.centerLat, wrapper.vm.centerLng], { icon: this.testIcon })]);
        // イベント発火
        wrapper.trigger('zoomstart')
        // 変更後の
        const lat = mapViewStore.maps[0].spots[0].coordinate.lat
        const lng = mapViewStore.maps[0].spots[0].coordinate.lng
        //expect(wrapper.vm.markers).toBe([lat, lng])
    });

    it('addMarkers スポットの追加', () => {
        
    });
});