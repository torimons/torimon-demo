import { mapViewStore } from '@/store/modules/MapViewModule';
import { MapViewState, SpotForMap, Coordinate } from '@/store/types';
import { shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import Map from '@/components/Map.ts';
import 'leaflet/dist/leaflet.css';
import L, { map } from 'leaflet';


const MapViewStoreTestData: MapViewState = {
    // マップのテストデータ
    maps: [
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
                    detailMapIds: [1],
                },
            ],
            nodes: [],
            edges: [],
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
                    gateNodeIds: [],
                },
            ],
            nodes: [],
            edges: [],
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
    focusedSpot: {
        mapId: 0,
        spotId: 0,
    },
    spotInfoIsVisible: false,
    focusedDetailMapId: 0,
    idOfCenterSpotWithDetailMap: 0,
};

describe('components/Map.vue マーカー切り替えのテスト', () => {
    // mapにするとleafletのmapと被ってshadowed name warningがでるので仕方なく...
    const mapInstance: Map = new Map();
    // テストデータ
    const testSpots: SpotForMap[] = [
        {
            id: 0,
            name: 'SougouGakusyuPlaza1',
            coordinate: {
                lat: 33.595502,
                lng: 130.218238,
            },
        },
        {
            id: 1,
            name: 'SougouGakusyuPlaza2',
            coordinate: {
                lat: 33.595503,
                lng: 130.218239,
            },
        },
    ];

    beforeEach(() => {
        mapViewStore.setMapViewState(MapViewStoreTestData);
    });


    it('switchMarkersがreplaceMarkersにMapViewStateから取得した情報を渡す', () => {
        /*
        switchMarkersはstoreのfocusedSpotのmapIdをみているので，
        getSpotsForMapにも同じ値(今回は初期値0)を与える.
        複数のマップに対してテストする場合，
        mapViewStore.setFocusedSpotなどで強制的にfocusedSpotを変更する必要がある
        */
        const mapId = MapViewStoreTestData.focusedSpot.mapId;
        const expectedSpots: SpotForMap[] = mapViewStore.getSpotsForMap(mapId);
        const actualSpots: SpotForMap[] = [];
        // replaceMarkersWithのモック
        (mapInstance as any).replaceMarkersWith = jest.fn((spots: SpotForMap[]) => {
            spots.forEach((spot) => actualSpots.push(spot));
        });

        (mapInstance as any).switchMarkers();
        expect(actualSpots).toStrictEqual(expectedSpots);
    });

    it('replaceMarkersWithに配列を渡してMapのmarkersに登録', () => {
        // コールバック関数は本テストに関係ないため空の関数を渡している
        (mapInstance as any).replaceMarkersWith(testSpots, () => {
            // do nothing
        });
        const actualMarkers = (mapInstance as any).markers;
        for (let i = 0; i < actualMarkers.length; i++) {
            const testLat: number = testSpots[i].coordinate.lat;
            const testLng: number = testSpots[i].coordinate.lng;
            const actLatLng = actualMarkers[i].getLatLng();
            // testSpotとactualSpotの座標がlatLng型で一致してるか
            expect(actLatLng).toStrictEqual(L.latLng(testLat, testLng));
        }
    });

    it('replaceMarkersに渡したコールバック関数が呼び出されいるか確認', () => {
        let functionCalled: boolean;
        (mapInstance as any).replaceMarkersWith(testSpots, () => {
            functionCalled = true;
        });
        const actualMarkers = (mapInstance as any).markers;
        for (const markers of actualMarkers) {
            functionCalled = false;
            // マーカーのクリック発火
            markers.fire('click');
            expect(functionCalled).toBe(true);
        }
    });
});
