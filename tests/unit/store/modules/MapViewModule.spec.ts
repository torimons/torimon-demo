import { mapViewGetters, mapViewMutations } from '@/store';
import { initMap } from '@/store/modules/MapViewModule/MapViewState';
import { MapViewState, RawMap, Bounds, SpotInfo, SpotForMap, RawSpot, DisplayLevelType } from '@/store/types';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import { testRawMapData } from '../../../resources/testRawMapData';
import { cloneDeep } from 'lodash';
import { NoDetailMapsError } from '@/store/errors/NoDetailMapsError';
import { MapNotFoundError } from '@/store/errors/MapNotFoundError';
import { NoDetailMapIdInSpotError } from '@/store/errors/NoDetailMapIdInSpotError';
import { SpotNotFoundError } from '@/store/errors/SpotNotFoundError';

describe('store/modules/MapViewModule.ts', () => {
    const testMapData: RawMap[] = cloneDeep(testRawMapData);
    const testRootMap: Map = initMap(testMapData);
    beforeEach(() => {
        // stateを入力するためにテスト用のmutationsを用意するしかなかった
        // 直接stateをモックしたり入力にできないか調べたい
        mapViewMutations.setRootMapForTest(testMapData);
    });

    it('stateに登録したSpotInfoコンポーネントの表示状態をgetterで取得する', () => {
        // 初期値はfalseがセットされている
        const actualSpotInfoIsVisible: boolean = mapViewGetters.spotInfoIsVisible;
        expect(actualSpotInfoIsVisible).toEqual(false);
    });

    it('setterでsetしたFocusedSpotがmapViewStoreのstateに登録されている', () => {
        const testFocusedSpot: Spot = testRootMap.getSpots()[0];
        mapViewMutations.setFocusedSpot(testFocusedSpot);
        const actualFocusedSpot: Spot | undefined = mapViewGetters.focusedSpot;
        expect(actualFocusedSpot).toBe(testFocusedSpot);
    });

    it('stateに登録したcenterSpotInRootMapを取得する', () => {
        // 初期値はnull
        expect(mapViewGetters.centerSpotInRootMap).toBe(null);
    });

    it('setCenterSpotInRootMap()でsetしたcenterSpotInRootMapがmapViewStoreのstateに登録されている', () => {
        const expectedSpotOfCenterSpotInRootMap = new Spot(0, 'expectedSpot', {lat: 0, lng: 0});
        mapViewMutations.setCenterSpotInRootMap(expectedSpotOfCenterSpotInRootMap);
        expect(mapViewGetters.centerSpotInRootMap).toBe(expectedSpotOfCenterSpotInRootMap);
    });

    it('setNonExistentOfCenterSpotInRootMap()でmapViewStoreのcenterSpotInRootMapにnullが登録されている', () => {
        mapViewMutations.setNonExistentOfCenterSpotInRootMap();
        expect(mapViewGetters.centerSpotInRootMap).toBe(null);
    });
});
