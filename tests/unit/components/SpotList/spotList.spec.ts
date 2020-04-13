import { shallowMount } from '@vue/test-utils';
import SpotList from '@/components/SpotList/index.vue';
import { GeolocationWrapper } from '@/components/MapView/GeolocationWrapper';
import { RawSpot } from '@/store/types';
import { getDistance } from 'geolib';

describe('SpotListコンポーネントのテスト', () => {
    let wrapper: any;

    beforeEach(() => {
        GeolocationWrapper.watchPosition = jest.fn();
        wrapper = shallowMount(SpotList, {
            attachToDocument: true,
        });
    });

    afterEach(() => {
        wrapper.destroy();
    });

    const testSpot: RawSpot = {
        id: 1,
        name: 'ウエスト2号館',
        coordinate: {
            lat: 33.59600170923035,
            lng: 130.21851181983948,
        },
        gateNodeIds: [],
        detailMapIds: [],
        detailMapLevelNames: [],
        lastViewedDetailMapId: null,
    };

    it('calculateDistanceFromCurrentPositionが取得された現在地とスポット間の距離を計算してformatした結果を返す', () => {
        const currentPosition = {
            lat: 33.595502,
            lng: 130.218238,
        };
        const expectedDistance = getDistance(testSpot.coordinate, currentPosition);
        wrapper.vm.currentPosition = currentPosition;
        wrapper.vm.formatDistance = jest.fn((distance) => {
            return distance.toString();
        });
        const resultDistanceInString = wrapper.vm.calculateDistanceFromCurrentPosition(testSpot);
        expect(resultDistanceInString).toBe(expectedDistance.toString());
    });

    it('現在地を取得できなかった場合、calculateDistanceFromCurrentPositionが空文字列を返す', () => {
        wrapper.vm.currentPosition = undefined;
        expect(wrapper.vm.calculateDistanceFromCurrentPosition(testSpot)).toBe('');
    });

    it('formatDistanceが数値の距離を値によって、mまたはkm付きの文字列に変換する', () => {
        // 受け取った数値が1000未満の場合、単位(m)をつけて文字列型に変換する
        expect(wrapper.vm.formatDistance(900)).toBe('900m');
        // 受け取った数値が1000以上の場合、小数第一位に丸め、単位(km)をつけて文字列型に変換する
        expect(wrapper.vm.formatDistance(1000)).toBe('1km');
        expect(wrapper.vm.formatDistance(2222)).toBe('2.2km');
    });
});
