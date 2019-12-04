import { mapViewStore } from '@/store/modules/MapViewModule';
import { MapViewState, Map, Bounds, SpotInfo, SpotForMap} from '@/store/types';
import {testMapViewState } from '../../../resources/testMapViewState';
import { cloneDeep } from 'lodash';

const expectedMapViewState: MapViewState = cloneDeep(testMapViewState);

describe('store/modules/MapViewModule.ts', () => {
    beforeEach(() => {
        // stateを入力するためにテスト用のmutationsを用意するしかなかった
        // 直接stateをモックしたり入力にできないか調べたい
        const expectedMapViewState: MapViewState = cloneDeep(testMapViewState);
        mapViewStore.setMapViewState(expectedMapViewState);
    });

    it('stateに登録したSpotInfoコンポーネントの表示状態をgetterで取得する', () => {
        const actualSpotInfoIsVisible: boolean = mapViewStore.spotInfoIsVisible;
        expect(actualSpotInfoIsVisible).toEqual(expectedMapViewState.spotInfoIsVisible);
    });

    it('stateに登録したmapのBoundsをgetterで取得する', () => {
        const actualMapBounds: Bounds = mapViewStore.rootMapBounds;
        expect(actualMapBounds).toEqual(expectedMapViewState.maps[expectedMapViewState.rootMapId].bounds);
    });

    it('stateに登録したSpotsからSpotForMap型の配列をgetterで取得する', () => {
        const actualSpotsForMap: SpotForMap[] = mapViewStore.getSpotsForMap(0);
        const expectedSpotsForMap: SpotForMap[] = [
            {
                id:       expectedMapViewState.maps[0].spots[0].id,
                name:     expectedMapViewState.maps[0].spots[0].name,
                coordinate: expectedMapViewState.maps[0].spots[0].coordinate,
                shape:    expectedMapViewState.maps[0].spots[0].shape,
            },
        ];
        expect(actualSpotsForMap).toEqual(expectedSpotsForMap);
    });

    it('stateに登録したSpotsの情報からcurrentSpotIdを持つSpotのSpotInfo型の情報をgetterで取得する', () => {
        const actualInfoOfCurrentSpot: SpotInfo = mapViewStore.infoOfFocusedSpot;
        const expectedFocusedMapId: number  = expectedMapViewState.focusedMapId;
        const expectedFocusedSpotId: number = expectedMapViewState.focusedSpotId;
        const expectedInfoOfCurrentSpot: SpotInfo = {
            name:  expectedMapViewState.maps[expectedFocusedMapId].spots[expectedFocusedSpotId].name,
        };
        expect(actualInfoOfCurrentSpot).toEqual(expectedInfoOfCurrentSpot);
    });

    it.skip('表示されている詳細マップのMapIdをgetLastViewedDetailMapIdで取得する', () => {
        const expectedMapViewStateWithLastViewedDetailMapId = Object.assign({}, expectedMapViewState);
        mapViewStore.setMapViewState(expectedMapViewStateWithLastViewedDetailMapId);
        const expectedLastViewedDetailMapId: number = 0;
        const testParentSpot = {
            parentMapId: 0,
            spotId: 0,
        };
        const testPayLoad = {
            detailMapId: expectedLastViewedDetailMapId,
            parentSpot: testParentSpot,
        };
        console.log(mapViewStore.maps[testParentSpot.parentMapId].spots[testParentSpot.spotId].lastViewedDetailMapId)
        mapViewStore.setLastViewedDetailMapId(testPayLoad);
        const actualLastViewedDetailMapId: number | null = mapViewStore.getLastViewedDetailMapId(testParentSpot);
        expect(actualLastViewedDetailMapId).toEqual(expectedLastViewedDetailMapId);
    });

    it.skip('詳細マップがない場合、getLastViewedDetailMapIdはNullを取得する', () => {
        const expectedLastViewedDetailMapId: null = null;
        const testParentSpot = {
            parentMapId: 0,
            spotId: 0,
        };
        console.log(mapViewStore.maps[testParentSpot.parentMapId].spots[testParentSpot.spotId].lastViewedDetailMapId)
        const actualLastViewedDetailMapId: number | null = mapViewStore.getLastViewedDetailMapId(testParentSpot);
        expect(actualLastViewedDetailMapId).toEqual(expectedLastViewedDetailMapId);
    });

    it('setterでsetしたcurrentSpotIdがmapViewStoreのstateに登録されている', () => {
        const expectedNewFocusedMapId: number  = 1;
        const expectedNewFocusedSpotId: number = 0;
        mapViewStore.setFocusedSpot({mapId: expectedNewFocusedMapId, spotId: expectedNewFocusedSpotId});
        const actualFocusedSpotId: number = mapViewStore.focusedSpotId;
        expect(actualFocusedSpotId).toBe(expectedNewFocusedSpotId);
    });

    it.skip('setterでsetしたlastViewedDetailMapIdがmapViewStoreのstoreに登録されている', () => {
        const expectedMapViewStateWithLastViewedDetailMapId = Object.assign({}, expectedMapViewState);
        mapViewStore.setMapViewState(expectedMapViewStateWithLastViewedDetailMapId);
        const expectedDetailMapId: number = 0;
        const testParentSpot = {
            parentMapId: 0,
            spotId: 0,
        };
        const testPayLoad = {
            detailMapId: expectedDetailMapId,
            parentSpot: testParentSpot,
        };
        mapViewStore.setLastViewedDetailMapId(testPayLoad);
        const actualDetailMapId: number | null = mapViewStore.maps[testPayLoad.parentSpot.parentMapId].spots[testPayLoad.parentSpot.spotId].lastViewedDetailMapId;
        expect(actualDetailMapId).toBe(expectedDetailMapId);
    });

});
