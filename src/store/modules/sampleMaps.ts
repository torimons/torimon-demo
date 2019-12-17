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
            {
                id: 215,
                name: '215',
                coordinate: {
                    lat: 33.59538954381066,
                    lng: 130.2182811498642,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.21827042102814, 33.59534932841202],
                            [130.21832406520844, 33.59536273354698],
                            [130.2182972431183, 33.59543869593907],
                            [130.218243598938, 33.59542082244106],
                            [130.21827042102814, 33.59534932841202]
                        ]
                    ],
                },
                gateNodeIds: [10],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 216,
                name: '216',
                coordinate: {
                    lat: 33.59540741731514,
                    lng: 130.21834015846252,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.21832942962646, 33.59536720192484],
                            [130.21839380264282, 33.595380607057024],
                            [130.21836161613464, 33.595456569433374],
                            [130.21830260753632, 33.59543869593907],
                            [130.21832942962646, 33.59536720192484]
                        ]
                    ],
                },
                gateNodeIds: [10],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 217,
                name: '217',
                coordinate: {
                    lat: 33.59542975919055, 
                    lng: 130.21839916706085,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.2183884382248, 33.595385075433946],
                            [130.2184420824051, 33.59539848056336],
                            [130.21841526031494, 33.59547444292398],
                            [130.21836161613464, 33.595456569433374],
                            [130.2183884382248, 33.595385075433946]
                        ],
                    ],
                },
                gateNodeIds: [10],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 218,
                name: '218',
                coordinate: {
                    lat: 33.59545210106014,
                    lng: 130.21845817565918, 
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.21844744682312, 33.59540741731514],
                            [130.21851181983948, 33.59542082244106],
                            [130.2184796333313, 33.59549678478202],
                            [130.21842062473297, 33.59547891129604],
                            [130.21844744682312, 33.59540741731514]
                        ]
                    ],
                },
                gateNodeIds: [10],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 219,
                name: '219',
                coordinate: {
                    lat: 33.595465506179146,
                    lng: 130.21852254867554,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.21811485290527, 33.59530017623266],
                            [130.21815240383148, 33.59531358137526],
                            [130.21813094615933, 33.59537167030247],
                            [130.21809339523315, 33.59535826516889],
                            [130.21811485290527, 33.59530017623266],
                        ],
                    ],
                },
                gateNodeIds: [10],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 220,
                name: '220',
                coordinate: {
                    lat: 33.595487848039504,
                    lng: 130.21858155727386,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.21856546401978, 33.595443164313],
                            [130.21862983703613, 33.595456569433374],
                            [130.21859765052795, 33.595532531742855],
                            [130.21853864192963, 33.595514658264285],
                            [130.21856546401978, 33.595443164313],
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
