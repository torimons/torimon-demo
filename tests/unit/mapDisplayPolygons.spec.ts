import { mapViewStore } from '@/store/modules/MapViewModule';
import map from '@/components/Map.vue';
import { MapViewState } from '@/store/types';
import { FeatureCollection } from 'geojson';
import { shallowMount } from '@vue/test-utils';


const mapViewStateTestData: MapViewState = {
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
                    shape: {
                        type: 'Polygon',
                        coordinates: [[
                            [ 130.21780639886853, 33.59551018989406  ],
                            [ 130.21791100502014, 33.595199637596735 ],
                            [ 130.2181014418602,  33.59524655564143  ],
                            [ 130.21809339523315, 33.59527783432369  ],
                            [ 130.21865129470825, 33.59543869593907  ],
                            [ 130.2185171842575,  33.595715734684546 ],
                            [ 130.21780639886853, 33.59551018989406  ],
                        ]],
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
                        coordinates: [[
                                [130.217816, 33.595257],
                                [130.217783, 33.595517],
                                [130.217915, 33.595558],
                                [130.217942, 33.595495],
                            ]],
                    },
                    gateNodeIds: [],
                    detailMapIds: [],
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
    focusedDetailMapId: null,
};

const expectedGeoJsonObject: FeatureCollection = {
    type: 'FeatureCollection',
    features: [{
        properties: {},
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [ 130.21780639886853, 33.59551018989406  ],
                [ 130.21791100502014, 33.595199637596735 ],
                [ 130.2181014418602,  33.59524655564143  ],
                [ 130.21809339523315, 33.59527783432369  ],
                [ 130.21865129470825, 33.59543869593907  ],
                [ 130.2185171842575,  33.595715734684546 ],
                [ 130.21780639886853, 33.59551018989406  ],
            ]],
        },
    }],
};


describe('mapコンポーネントのポリゴン表示', () => {
    let wrapper: any;
    beforeEach(() => {
        // テスト用データをstoreにセット
        mapViewStore.setMapViewState(mapViewStateTestData);
        wrapper = shallowMount( map, {
            attachToDocument: true,
        });
    });

    it('storeのgetter(getSpotsForMap)で取得したspotのshape情報をgeoJson形式に変換する', () => {
        const spotsForMap = mapViewStore.getSpotsForMap(0);
        const actualGeoJsonFormat =  wrapper.vm.spotShapeToGeoJson(spotsForMap);
        const expectedGeoJsonFormat = expectedGeoJsonObject;
        expect(actualGeoJsonFormat).toStrictEqual(expectedGeoJsonFormat);
    });

});
