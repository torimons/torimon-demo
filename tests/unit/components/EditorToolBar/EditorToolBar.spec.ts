import { mapViewMutations } from '@/store';
import { shallowMount } from '@vue/test-utils';
import 'leaflet/dist/leaflet.css';
import { testRawMapData } from '../../../resources/testRawMapData';
import EditorToolBar from '@/components/EditorToolBar';
import { Action } from '@/components/EditorToolBar';


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

    it('emitSpotTypeメソッドが引数のアイコン名に対応したSpotTypeを返す', () => {
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

    it('switchModeに"spot"アクションが渡された場合にSpotボタンの色を表すフィールドのみがselectedColorになる', () => {
        const selectedColor: string = wrapper.vm.selectedColor;
        const defaultColor: string = wrapper.vm.defaultColor;

        wrapper.vm.switchMode('spot');
        const acutualButtons: Array<{ action: Action, icon: string, color: string }> = wrapper.vm.buttons;
        const acutualColorsWithoutSpot = acutualButtons.map((button) => button.color);
        acutualColorsWithoutSpot.forEach((acutualColor) => {
            expect(acutualColor).toBe(defaultColor);
        });
        expect(wrapper.vm.spotButtonColor).toBe(selectedColor);
    });

    it('switchModeにアクション(非"spot")が渡された場合にそのアクションのボタンの色を表すフィールドのみがselectedColorになる', () => {
        const selectedColor: string = wrapper.vm.selectedColor;
        const defaultColor: string = wrapper.vm.defaultColor;

        wrapper.vm.switchMode('move');
        expect(wrapper.vm.spotButtonColor).toBe(defaultColor);
        const acutualZoomInButtonColor = wrapper.vm.buttons[0].color;
        const acutualZoomOutButtonColor = wrapper.vm.buttons[1].color;
        const acutualMoveButtonColor = wrapper.vm.buttons[2].color;
        expect(acutualMoveButtonColor).toBe(selectedColor);
        expect(acutualZoomInButtonColor).toBe(defaultColor);
        expect(acutualZoomOutButtonColor).toBe(defaultColor);
        expect(wrapper.vm.spotButtonColor).toBe(defaultColor);
    });

    it('setSelectedSpotIconのテスト', () => {
        wrapper.vm.setSelectedSpotIcon('place');
        expect(wrapper.vm.selectedSpotIcon).toBe('place');
    });

});
