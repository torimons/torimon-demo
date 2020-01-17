import { MapViewState } from '@/store/types';

export const testMapViewState2: MapViewState = {
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
                        ]],
                    },
                    gateNodeIds: [],
                    detailMapIds: [1, 2],
                    detailMapLevelNames: ['1F', '2F'],
                    lastViewedDetailMapId: null,
                    description: '総合学習プラザです',
                },
                {
                    id: 1,
                    name: 'West2',
                    coordinate: {
                        lat: 33.595502,
                        lng: 130.700008,
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
                        ]],
                    },
                    gateNodeIds: [],
                    detailMapIds: [],
                    detailMapLevelNames: [],
                    lastViewedDetailMapId: null,
                    attachment: [
                        {name: 'testName', url: 'testUrl'},
                    ],
                },
                {
                    id: 2,
                    name: 'testSpot',
                    coordinate: {
                        lat: 33.59600170923035,
                        lng: 130.21851181983948,
                    },
                    shape: {
                        type: 'Polygon',
                        coordinates: [[
                            [130.21777153015137, 33.59563083580872],
                            [130.21852791309357, 33.5958453170181 ],
                            [130.21932184696198, 33.59591681063602],
                            [130.21930038928986, 33.59628321449781],
                            [130.21841526031494, 33.59618937951075],
                            [130.21755158901215, 33.59601511426391],
                            [130.21777153015137, 33.59563083580872],
                        ] ],
                    },
                    gateNodeIds: [],
                    detailMapIds: [3],
                    detailMapLevelNames: [],
                    lastViewedDetailMapId: 3,
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
            name: 'SougouGakusyuPlaza_1F',
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
                    detailMapIds: [],
                    detailMapLevelNames: [],
                    lastViewedDetailMapId: null,
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
        {
            id: 2,
            name: 'SougouGakusyuPlaza_2F',
            spots: [
                {
                    id: 10,
                    name: '201',
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
                    gateNodeIds: [10],
                    detailMapIds: [],
                    detailMapLevelNames: [],
                    lastViewedDetailMapId: null,
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
        {
            id: 3,
            name: 'testMap',
            spots: [
                {
                    id: 10,
                    name: '201',
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
                    gateNodeIds: [10],
                    detailMapIds: [],
                    detailMapLevelNames: [],
                    lastViewedDetailMapId: null,
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
    displayLevel: 'default',
    idOfCenterSpotInRootMap: null,
};

