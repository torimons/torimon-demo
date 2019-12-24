import { mapViewStore } from '@/store/modules/MapViewModule';
import { MapViewState, Map, Bounds, SpotInfo, SpotForMap, Spot, DisplayLevelType } from '@/store/types';
import { testMapViewState } from '../../../resources/testMapViewState';
import { cloneDeep } from 'lodash';
import { NoDetailMapsError } from '@/store/errors/NoDetailMapsError';
import { MapNotFoundError } from '@/store/errors/MapNotFoundError';
import { NoDetailMapIdInSpotError } from '@/store/errors/NoDetailMapIdInSpotError';
import { SpotNotFoundError } from '@/store/errors/SpotNotFoundError';

const expectedMapViewState: MapViewState = cloneDeep(testMapViewState);

describe('store/modules/MapViewModule.ts', () => {
    beforeEach(() => {
        // stateを入力するためにテスト用のmutationsを用意するしかなかった
        // 直接stateをモックしたり入力にできないか調べたい
        const mapViewState = cloneDeep(testMapViewState);
        mapViewStore.setMapViewState(mapViewState);
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
            {
                id:       expectedMapViewState.maps[0].spots[1].id,
                name:     expectedMapViewState.maps[0].spots[1].name,
                coordinate: expectedMapViewState.maps[0].spots[1].coordinate,
                shape:    expectedMapViewState.maps[0].spots[1].shape,
            },
        ];
        expect(actualSpotsForMap).toEqual(expectedSpotsForMap);
    });

    it('stateに登録したSpotsの情報からFocusedSpotIdを持つSpotのSpotInfo型の情報をgetterで取得する', () => {
        const actualInfoOfFocusedSpot: SpotInfo = mapViewStore.infoOfFocusedSpot;
        const expectedFocusedMapId: number  = expectedMapViewState.focusedSpot.mapId;
        const expectedFocusedSpotId: number = expectedMapViewState.focusedSpot.spotId;
        const expectedInfoOfFocusedSpot: SpotInfo = {
            name:  expectedMapViewState.maps[expectedFocusedMapId].spots[expectedFocusedSpotId].name,
        };
        expect(actualInfoOfFocusedSpot).toEqual(expectedInfoOfFocusedSpot);
    });

    it('spotHasDetailMaps()で詳細マップを持つかどうかを判定する', () => {
        // 詳細マップを持っている場合
        const expectedValWithDetailMaps: boolean = true;
        const targetSpotWithDetailMaps = {
            parentMapId: 0,
            spotId: 0,
        };
        const actualValWithDetailMaps: boolean = mapViewStore.spotHasDetailMaps(targetSpotWithDetailMaps);
        expect(actualValWithDetailMaps).toBe(expectedValWithDetailMaps);

        // 詳細マップを持っていない場合
        const expectedValWithoutDetailMaps: boolean = false;
        const targetSpotWithoutDetailMaps = {
            parentMapId: 2,
            spotId: 10,
        };
        const actualValWithoutDetailMaps: boolean = mapViewStore.spotHasDetailMaps(targetSpotWithoutDetailMaps);
        expect(actualValWithoutDetailMaps).toBe(expectedValWithoutDetailMaps);
    });

    it('getSpotById()で指定のスポットを取得する', () => {
        const targetSpot = {
            parentMapId: 0,
            spotId: 0,
        };
        const mapIndex = mapViewStore.maps.findIndex((m: Map) => m.id === targetSpot.parentMapId);
        const spotIndex = mapViewStore.maps[mapIndex].spots.findIndex((s: Spot) => s.id === targetSpot.spotId);
        const expectedSpot: Spot = mapViewStore.maps[mapIndex].spots[spotIndex];
        const actualSpot: Spot = mapViewStore.getSpotById(targetSpot);
        expect(actualSpot).toStrictEqual(expectedSpot);
    });

    it('getSpotById()に存在しないマップIdやスポットIdを渡すと例外が発生する', () => {
        // 存在しないマップIdを指定した場合
        const targetSpotWithWrongMapId = {
            parentMapId: 999,
            spotId: 0,
        };
        expect(() => {
            const _ = mapViewStore.getSpotById(targetSpotWithWrongMapId);
        }).toThrow(MapNotFoundError);

        // 存在しないスポットIdを指定した場合
        const targetSpotWithWrongSpotId = {
            parentMapId: 0,
            spotId: 999,
        };
        expect(() => {
            const _ = mapViewStore.getSpotById(targetSpotWithWrongSpotId);
        }).toThrow(SpotNotFoundError);
    });

    it('setterでsetしたFocusedSpotがmapViewStoreのstateに登録されている', () => {
        const expectedNewFocusedSpot: {mapId: number, spotId: number} = {
            mapId: 1,
            spotId: 0,
        };
        mapViewStore.setFocusedSpot(expectedNewFocusedSpot);
        const actualFocusedSpot: {mapId: number, spotId: number} = mapViewStore.focusedSpot;
        expect(actualFocusedSpot).toBe(expectedNewFocusedSpot);
    });

    it('getLastViewedDetailMapIdでスポットの参照された詳細マップIdを取得する', () => {
        // lastViewdDetailMapIdの初期値はnullである
        const expectedLastViewedDetailMapId: null = null;
        const targetSpot = {
            parentMapId: 0,
            spotId: 0,
        };
        const actualLastViewedDetailMapId: number | null = mapViewStore.getLastViewedDetailMapId(targetSpot);
        expect(actualLastViewedDetailMapId).toEqual(expectedLastViewedDetailMapId);
    });

    it('getLastViewdDetailMapIdで，詳細マップを持たないスポットが指定された場合，例外を投げる', () => {
        const targetSpotWithWrongSpotId = {
            parentMapId: 2,
            spotId: 10,
        };
        expect(() => {
            const _ = mapViewStore.getLastViewedDetailMapId(targetSpotWithWrongSpotId);
        }).toThrow(NoDetailMapsError);
    });

    it('stateに登録したidOfCenterSpotWithDetailMapを取得する', () => {
        const expectedId: number | null = expectedMapViewState.idOfCenterSpotWithDetailMap;
        expect(mapViewStore.getIdOfCenterSpotWithDetailMap()).toBe(expectedId);
    });

    it('スポットに存在しない詳細マップをlastViewDetaiMapIdにセットしようとすると例外が発生する', () => {
        const wrongDetailMapId: number = 999;
        const payload = {
            detailMapId: wrongDetailMapId,
            parentSpot: {
                parentMapId: 0,
                spotId: 0,
            },
        };
        expect(() => {
            mapViewStore.setLastViewedDetailMapId(payload);
        }).toThrow(NoDetailMapIdInSpotError);
    });

    it('setLastViewedDetailMapIdでセットしたIdがmapViewStoreに登録されている', () => {
        const expectedDetailMapId: number = 1;

        // setterで値をセット
        const parentMapId: number = 0;
        const spotId: number = 0;
        const payLoad = {
            detailMapId: expectedDetailMapId,
            parentSpot: {
                parentMapId: 0,
                spotId: 0,
            },
        };
        mapViewStore.setLastViewedDetailMapId(payLoad);

        // 正しくセットされたかをチェック
        const mapIndex: number = mapViewStore.maps.findIndex((m: Map) => m.id === parentMapId);
        const spotIndex: number = mapViewStore.maps[mapIndex].spots.findIndex((s: Spot) => s.id === spotId);
        const actualDetailMapId: number | null = mapViewStore.maps[mapIndex].spots[spotIndex].lastViewedDetailMapId;
        expect(actualDetailMapId).toBe(expectedDetailMapId);
    });

    it('setIdOfCenterSpotWithDetailMap()でsetしたidOfCenterSpotWithDetailMapがmapViewStoreのstateに登録されている', () => {
        const expectedIdOfCenterSpotWithDetailMap = 1;
        mapViewStore.setIdOfCenterSpotWithDetailMap(expectedIdOfCenterSpotWithDetailMap);
        expect(mapViewStore.idOfCenterSpotWithDetailMap).toBe(expectedIdOfCenterSpotWithDetailMap);
    });

    it('setNonExistentOfCenterSpotWithDetailMap()でmapViewStoreのidOfCenterSpotWithDetailMapにnullが登録されている', () => {
        mapViewStore.setNonExistentOfCenterSpotWithDetailMap();
        expect(mapViewStore.idOfCenterSpotWithDetailMap).toBe(null);
    });

    it('setしたnewDisplayLevelがstateに登録されている', () => {
        const newDisplayLevel: DisplayLevelType = 'detail';
        mapViewStore.setDisplayLevel(newDisplayLevel);
        expect(mapViewStore.displayLevel).toBe(newDisplayLevel);
    });

    it('stateのdisplayLevelをgetterで取得する', () => {
        // テストデータの初期値はdefault
        const expectedDisplayLevel: DisplayLevelType = 'default';
        expect(mapViewStore.getDisplayLevel()).toBe(expectedDisplayLevel);
    });
});
