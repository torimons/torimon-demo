import { mapViewStore } from '@/store/modules/MapViewModule';
import { MapViewState, Map, Bounds, SpotInfo, SpotForMap} from '@/store/types';

const expectedMapViewState: MapViewState = {
    maps : [
        {
            id: 0,
            name: 'Kyudai',
            spots: [
                {
                    id: 0,
                    name: 'SougouGakusyuPlaza',
                    coordinate: {
                        lat: 33.595502,
                        lng: 130.218238,
                    },
                    floor: 1,
                    shape: {
                        type: 'Polygon',
                        coordinates: [[
                            [
                                130.21780639886853,
                                33.59551018989406,
                            ],
                            [
                                130.21791100502014,
                                33.595199637596735,
                            ],
                            [
                                130.2181014418602,
                                33.59524655564143,
                            ],
                            [
                                130.21809339523315,
                                33.59527783432369,
                            ],
                            [
                                130.21865129470825,
                                33.59543869593907,
                            ],
                            [
                                130.2185171842575,
                                33.595715734684546,
                            ],
                            [
                                130.21780639886853,
                                33.59551018989406,
                            ],
                        ] ],
                    },
                    gateNodeIds: [],
                    detailMapId: 1,
                },
            ],
            bounds: {
                topL: {
                    lat: 33.596643,
                    lng: 130.215516,
                },
                botR: {
                    lat: 33.594083,
                    lng: 130.220609,
                },
            },

        },
        {
            id: 1,
            name: 'SougouGakusyuPlaza',
            spots: [
                {
                    id: 0,
                    name: '101',
                    coordinate: {
                        lat: 33.5954558,
                        lng: 130.2179447,
                    },
                    shape: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [130.217816, 33.595257],
                                [130.217783, 33.595517],
                                [130.217915, 33.595558],
                                [130.217942, 33.595495],
                            ],
                        ],
                    },
                    floor: 1,
                    gateNodeIds: [],
                },
            ],
            bounds: {
                topL: {
                    lat: 33.5954678,
                    lng: 130.2177802,
                },
                botR: {
                    lat: 33.5954678,
                    lng: 130.2177802,
                },
            },
        },
    ],
    rootMapId: 0,
    focusedMapId: 0,
    focusedSpotId: 0,
    spotInfoIsVisible: false,
    focusedDetailMapId: null,
};


describe('store/modules/MapViewModule.ts', () => {
    beforeEach(() => {
        // stateを入力するためにテスト用のmutationsを用意するしかなかった
        // 直接stateをモックしたり入力にできないか調べたい
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
                floor:    expectedMapViewState.maps[0].spots[0].floor,
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
            floor: expectedMapViewState.maps[expectedFocusedMapId].spots[expectedFocusedSpotId].floor,
        };
        expect(actualInfoOfCurrentSpot).toEqual(expectedInfoOfCurrentSpot);
    });

    it('表示されている詳細マップのMapIdをgetFoucusedDetailMapIdで取得する', () => {
        const expectedDetailMapId = 0;
        mapViewStore.setFocusedDetailMapId(expectedDetailMapId);
        const actualFocusedDetailMapId = mapViewStore.getFocusedDetailMapId;
        expect(actualFocusedDetailMapId).toEqual(expectedDetailMapId);
    });

    it('詳細マップがない場合、getFocusedDetailMapIdはNullを取得し例外を投げる', () => {
        const detailMapIdNull = null;
        mapViewStore.setFocusedDetailMapId(detailMapIdNull);
        expect(() => {
            const _ = mapViewStore.getFocusedDetailMapId;
        }).toThrow(Error);
    });


    it('setterでsetしたcurrentSpotIdがmapViewStoreのstateに登録されている', () => {
        const expectedNewFocusedMapId: number  = 1;
        const expectedNewFocusedSpotId: number = 0;
        mapViewStore.setFocusedSpot({mapId: expectedNewFocusedMapId, spotId: expectedNewFocusedSpotId});
        const actualFocusedSpotId: number = mapViewStore.focusedSpotId;
        expect(actualFocusedSpotId).toBe(expectedNewFocusedSpotId);
    });

    it('setterでsetしたfocusedDetailMapIdがmapViewStoreのstoreに登録されている', () => {
        const expectedFocusedDetailMapId: number = 1;
        mapViewStore.setFocusedDetailMapId(expectedFocusedDetailMapId);
        const actualFocusedDetailMapId: number | null = mapViewStore.focusedDetailMapId;
        expect(actualFocusedDetailMapId).toBe(expectedFocusedDetailMapId);
    });

});
