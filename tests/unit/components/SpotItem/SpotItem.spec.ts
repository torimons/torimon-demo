import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import { mapViewGetters, mapViewMutations } from '@/store/newMapViewIndex';
import SpotItem from '@/components/SpotItem/index.vue';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

describe('components/SpotItem.vue', () => {
    let localVue: any;
    let wrapper: any;
    let vuetify: any;
    const testSpot: Spot = new Spot(0, 'testSpot', {lat: 0, lng: 0});
    const parentMap: Map = new Map(1, 'parentMap', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}});
    parentMap.addSpots([testSpot]);

    beforeEach(() => {
        vuetify = new Vuetify();
        localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(Vuetify);
        wrapper = mount( SpotItem, {
            localVue,
            vuetify,
            attachToDocument: true,
            propsData: {
                spot: testSpot,
            },
        });
    });

    it('SpotList内のSpotItemが選択されるとfocusedSpotの更新をおこなう', () => {
        wrapper.find('.v-card').trigger('click');
        expect(mapViewGetters.focusedSpot).toStrictEqual(testSpot);
    });
});
