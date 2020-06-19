import { mapViewMutations } from '@/store';
import { shallowMount } from '@vue/test-utils';
import 'leaflet/dist/leaflet.css';
import { testRawMapData } from '../../../resources/testRawMapData';
import EditorToolBar from '@/components/EditorToolBar';
import Map from '@/Map/Map';


describe('components/EditorToolVar', () => {
    let wrapper: any;

    beforeEach(() => {
        mapViewMutations.setRootMapForTest(testRawMapData);
        wrapper = shallowMount(EditorToolBar, {
            attachToDocument: true,
        });
    });

    afterEach(() => {
        // Map components already initialized防止
        wrapper.destroy();
    });

    it('', () => {
        const actualSpotTypeOfPlaceIcon = wrapper.vm.emitSpotType('place');
        const expectedSpotTypeOfPalceIcon = 'default';
        expect(actualSpotTypeOfPlaceIcon).toBe(expectedSpotTypeOfPalceIcon);

        const actualSpotTypeOfAddLocationIcon = wrapper.vm.emitSpotType('add_location');
        const expectedSpotTypeOfAddLocationIcon = 'withDetailMap';
        expect(actualSpotTypeOfAddLocationIcon).toBe(expectedSpotTypeOfAddLocationIcon);

        const actualSpotTypeOfWCIcon = wrapper.vm.emitSpotType('wc');
        const expectedSpotTypeOfWCIcon = 'restroom';
        expect(actualSpotTypeOfWCIcon).toBe(expectedSpotTypeOfWCIcon);
    });
});
