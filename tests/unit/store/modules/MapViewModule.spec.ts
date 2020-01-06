import { mapViewGetters, mapViewMutations } from '@/store';
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
        mapViewMutations.setMapViewState(mapViewState);
    });

    it('stateに登録したSpotInfoコンポーネントの表示状態をgetterで取得する', () => {
        const actualSpotInfoIsVisible: boolean = mapViewGetters.spotInfoIsVisible;
        expect(actualSpotInfoIsVisible).toEqual(expectedMapViewState.spotInfoIsVisible);
    });

    it('stateに登録したmapのBoundsをgetterで取得する', () => {
        const actualMapBounds: Bounds = mapViewGetters.rootMapBounds;
        expect(actualMapBounds).toEqual(expectedMapViewState.maps[expectedMapViewState.rootMapId].bounds);
    });

    it('stateに登録したSpotsからSpotForMap型の配列をgetterで取得する', () => {
        const actualSpotsForMap: SpotForMap[] = mapViewGetters.getSpotsForMap(0);
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

    it('getSpotInfoでSpotInfoコンポーネントで表示する内容を取得する(descriptionあり,attachmentなし)', () => {
        const mapId: number = 0;
        const spotId: number = 0;
        const actualSpotInfo: SpotInfo = mapViewGetters.getSpotInfo({mapId, spotId});
        const expectedSpotInfo: SpotInfo = {
            name: 'SougouGakusyuPlaza',
            description: '総合学習プラザです',
            attachment: [
                {name: '', url: ''},
            ],
        };
        expect(actualSpotInfo).toStrictEqual(expectedSpotInfo);
    });

    it('getSpotInfoでSpotInfoコンポーネントで表示する内容を取得する(descriptionなし,attachmentあり)', () => {
        const mapId: number = 0;
        const spotId: number = 1;
        const actualSpotInfo: SpotInfo = mapViewGetters.getSpotInfo({mapId, spotId});
        const expectedSpotInfo: SpotInfo = {
            name: 'West2',
            description: '',
            attachment: [
                {name: 'testName', url: 'testUrl'},
            ],
        };
        expect(actualSpotInfo).toStrictEqual(expectedSpotInfo);
    });

    it('spotHasDetailMaps()で詳細マップを持つかどうかを判定する', () => {
        // 詳細マップを持っている場合
        const expectedValtInRootMaps: boolean = true;
        const targetSpottInRootMaps = {
            parentMapId: 0,
            spotId: 0,
        };
        const actualValtInRootMaps: boolean = mapViewGetters.spotHasDetailMaps(targetSpottInRootMaps);
        expect(actualValtInRootMaps).toBe(expectedValtInRootMaps);

        // 詳細マップを持っていない場合
        const expectedValWithoutDetailMaps: boolean = false;
        const targetSpotWithoutDetailMaps = {
            parentMapId: 2,
            spotId: 10,
        };
        const actualValWithoutDetailMaps: boolean = mapViewGetters.spotHasDetailMaps(targetSpotWithoutDetailMaps);
        expect(actualValWithoutDetailMaps).toBe(expectedValWithoutDetailMaps);
    });

    it('getSpotById()で指定のスポットを取得する', () => {
        const targetSpot = {
            parentMapId: 0,
            spotId: 0,
        };
        const mapIndex = mapViewGetters.maps.findIndex((m: Map) => m.id === targetSpot.parentMapId);
        const spotIndex = mapViewGetters.maps[mapIndex].spots.findIndex((s: Spot) => s.id === targetSpot.spotId);
        const expectedSpot: Spot = mapViewGetters.maps[mapIndex].spots[spotIndex];
        const actualSpot: Spot = mapViewGetters.getSpotById(targetSpot);
        expect(actualSpot).toStrictEqual(expectedSpot);
    });

    it('getSpotById()に存在しないマップIdやスポットIdを渡すと例外が発生する', () => {
        // 存在しないマップIdを指定した場合
        const targetSpotWithWrongMapId = {
            parentMapId: 999,
            spotId: 0,
        };
        expect(() => {
            const _ = mapViewGetters.getSpotById(targetSpotWithWrongMapId);
        }).toThrow(MapNotFoundError);

        // 存在しないスポットIdを指定した場合
        const targetSpotWithWrongSpotId = {
            parentMapId: 0,
            spotId: 999,
        };
        expect(() => {
            const _ = mapViewGetters.getSpotById(targetSpotWithWrongSpotId);
        }).toThrow(SpotNotFoundError);
    });

    it('setterでsetしたFocusedSpotがmapViewStoreのstateに登録されている', () => {
        const expectedNewFocusedSpot: {mapId: number, spotId: number} = {
            mapId: 1,
            spotId: 0,
        };
        mapViewMutations.setFocusedSpot(expectedNewFocusedSpot);
        const actualFocusedSpot: {mapId: number, spotId: number} = mapViewGetters.focusedSpot;
        expect(actualFocusedSpot).toBe(expectedNewFocusedSpot);
    });

    it('getLastViewedDetailMapIdでスポットの参照された詳細マップIdを取得する', () => {
        // lastViewdDetailMapIdの初期値はnullである
        const expectedLastViewedDetailMapId: null = null;
        const targetSpot = {
            parentMapId: 0,
            spotId: 0,
        };
        const actualLastViewedDetailMapId: number | null = mapViewGetters.getLastViewedDetailMapId(targetSpot);
        expect(actualLastViewedDetailMapId).toEqual(expectedLastViewedDetailMapId);
    });

    it('getLastViewdDetailMapIdで，詳細マップを持たないスポットが指定された場合，例外を投げる', () => {
        const targetSpotWithWrongSpotId = {
            parentMapId: 2,
            spotId: 10,
        };
        expect(() => {
            const _ = mapViewGetters.getLastViewedDetailMapId(targetSpotWithWrongSpotId);
        }).toThrow(NoDetailMapsError);
    });

    it('stateに登録したidOfCenterSpotInRootMapを取得する', () => {
        const expectedId: number | null = expectedMapViewState.idOfCenterSpotInRootMap;
        expect(mapViewGetters.idOfCenterSpotInRootMap).toBe(expectedId);
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
            mapViewMutations.setLastViewedDetailMapId(payload);
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
        mapViewMutations.setLastViewedDetailMapId(payLoad);

        // 正しくセットされたかをチェック
        const mapIndex: number = mapViewGetters.maps.findIndex((m: Map) => m.id === parentMapId);
        const spotIndex: number = mapViewGetters.maps[mapIndex].spots.findIndex((s: Spot) => s.id === spotId);
        const actualDetailMapId: number | null = mapViewGetters.maps[mapIndex].spots[spotIndex].lastViewedDetailMapId;
        expect(actualDetailMapId).toBe(expectedDetailMapId);
    });

    it('setIdOfCenterSpotInRootMap()でsetしたIdOfCenterSpotInRootMapがmapViewStoreのstateに登録されている', () => {
        const expectedIdOfCenterSpotInRootMap = 1;
        mapViewMutations.setIdOfCenterSpotInRootMap(expectedIdOfCenterSpotInRootMap);
        expect(mapViewGetters.idOfCenterSpotInRootMap).toBe(expectedIdOfCenterSpotInRootMap);
    });

    it('setNonExistentOfCenterSpotInRootMap()でmapViewStoreのIdOfCenterSpotInRootMapにnullが登録されている', () => {
        mapViewMutations.setNonExistentOfCenterSpotInRootMap();
        expect(mapViewGetters.idOfCenterSpotInRootMap).toBe(null);
    });

    it('setしたnewDisplayLevelがstateに登録されている', () => {
        const newDisplayLevel: DisplayLevelType = 'detail';
        mapViewMutations.setDisplayLevel(newDisplayLevel);
        expect(mapViewGetters.displayLevel).toBe(newDisplayLevel);
    });

    it('stateのdisplayLevelをgetterで取得する', () => {
        // テストデータの初期値はdefault
        const expectedDisplayLevel: DisplayLevelType = 'default';
        expect(mapViewGetters.displayLevel).toBe(expectedDisplayLevel);
    });
});
