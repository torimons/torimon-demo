import { Map } from '@/store/types';

export const sampleMaps: Map[] =  [
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
                detailMapLevelNames: [],
                lastViewedDetailMapId: null,
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
                detailMapIds: [1],
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
                lastViewedDetailMapId: null,
                others: {},
            },
            /* template
            {
                id: 16,
                name: '207',
                coordinate: {
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                    ],
                },
                gateNodeIds: [],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            */
            {
                id: 15,
                name: '206',
                coordinate: {
                    lat: 33.59536273354698,
                    lng: 130.2179592847824,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.2179056406021,  33.595291239469766],
                            [130.2180504798889,  33.59533592327497],
                            [130.21800756454468, 33.59543869593907],
                            [130.21786272525787, 33.59539401218712],
                            [130.2179056406021,  33.595291239469766],
                        ],
                    ],
                },
                gateNodeIds: [],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 16,
                name: '207',
                coordinate: {
                    lat: 33.59557274705605,
                    lng: 130.2184957265854,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.2184420824051,  33.59550572152362],
                            [130.2185869216919,  33.59554593684934],
                            [130.2185493707657,  33.59563530417269],
                            [130.21840453147888, 33.59559062052259],
                            [130.2184420824051,  33.59550572152362],
                        ],
                    ],
                },
                gateNodeIds: [],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 17,
                name: '208',
                coordinate: {
                    lat: 33.595228682103595,
                    lng: 130.2179378271103,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.2179217338562, 33.5951974034035],
                            [130.2179753780365, 33.5952152769478],
                            [130.2179592847824, 33.595251024025295],
                            [130.2179056406021, 33.595233150488404],
                            [130.2179217338562, 33.5951974034035],
                        ],
                    ],
                },
                gateNodeIds: [],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
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
];
