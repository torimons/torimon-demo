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
                parentSpotIds: [],
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
                parentSpotIds: [],
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
];
