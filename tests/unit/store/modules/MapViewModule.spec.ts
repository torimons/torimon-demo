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

    it('表示された詳細マップのMapIdをgetLastViewedDetailMapIdで取得する', () => {
        const expectedLastViewedDetailMapId: number = 1;
        const parentMapId: number = 0;
        const spotId: number = 0;
        const parentSpot = {
            parentMapId: parentMapId,
            spotId: spotId,
        };
        const payload = {
            detailMapId: expectedLastViewedDetailMapId,
            parentSpot: parentSpot,
        };
        mapViewStore.setLastViewedDetailMapId(payload);
        const actualLastViewedDetailMapId: number | null = mapViewStore.getLastViewedDetailMapId(parentSpot);
        expect(actualLastViewedDetailMapId).toEqual(expectedLastViewedDetailMapId);
    });

    it('詳細マップを参照していない場合、getLastViewedDetailMapIdはNullを取得する', () => {
        // lastViewdDetailMapIdの初期値はnullであるため，詳細マップを参照していない場合はnullが返る．
        const expectedLastViewedDetailMapId: null = null;
        const parentMapId: number = 0;
        const spotId: number = 0;
        const parentSpot = {
            parentMapId: parentMapId,
            spotId: spotId,
        };
        const actualLastViewedDetailMapId: number | null = mapViewStore.getLastViewedDetailMapId(parentSpot);
        expect(actualLastViewedDetailMapId).toEqual(expectedLastViewedDetailMapId);
    });

    it('setterでsetしたcurrentSpotIdがmapViewStoreのstateに登録されている', () => {
        const expectedNewFocusedMapId: number  = 1;
        const expectedNewFocusedSpotId: number = 0;
        mapViewStore.setFocusedSpot({mapId: expectedNewFocusedMapId, spotId: expectedNewFocusedSpotId});
        const actualFocusedSpotId: number = mapViewStore.focusedSpotId;
        expect(actualFocusedSpotId).toBe(expectedNewFocusedSpotId);
    });

    it('setterでsetしたlastViewedDetailMapIdがmapViewStoreのstoreに登録されている', () => {
        const expectedDetailMapId: number = 1;
        const parentMapId: number = 0;
        const spotId: number = 0;
        const testParentSpot = {
            parentMapId: parentMapId,
            spotId: spotId,
        };
        const payLoad = {
            detailMapId: expectedDetailMapId,
            parentSpot: testParentSpot,
        };
        mapViewStore.setLastViewedDetailMapId(payLoad);
        const actualDetailMapId: number | null = mapViewStore.maps[parentMapId].spots[spotId].lastViewedDetailMapId;
        expect(actualDetailMapId).toBe(expectedDetailMapId);
    });

});
