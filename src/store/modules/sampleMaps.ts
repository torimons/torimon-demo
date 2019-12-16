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
                    coordinates: [
                        [
                            [130.21791636943817, 33.59517952985549],
                            [ 130.21812558174133, 33.59524208725731],
                            [130.2181041240692, 33.595291239469766],
                            [ 130.21862983703613, 33.595465506179146],
                            [130.2184957265854, 33.59572913976256],
                            [130.2177768945694, 33.59551018989406],
                            [130.21791636943817, 33.59517952985549],
                        ],
                    ],
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
        id: 1,
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
