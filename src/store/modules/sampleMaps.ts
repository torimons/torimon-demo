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
        id: 20,
        name: 'West_2F',
        spots: [
            {
                id: 201,
                name: '201',
                coordinate: {
                    lat: 33.59595702577006,
                    lng: 130.2189141511917,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.2188014984131, 33.595890000536244],
                            [130.2189838886261, 33.595903405587165],
                            [130.21895170211792, 33.595974899156964],
                            [130.218785405159, 33.595965962463985],
                            [130.2188014984131, 33.595890000536244],
                        ],
                    ],
                },
                gateNodeIds: [10],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 202,
                name: '202',
                coordinate: {
                    lat: 33.59592574733411,
                    lng: 130.21868348121643,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.2185869216919, 33.595863190428126],
                            [130.21866738796234, 33.59587212713177],
                            [130.21866738796234, 33.59596149411714],
                            [130.21858155727386, 33.59594808907523],
                            [130.2185869216919, 33.595863190428126],
                        ],
                    ],
                },
                gateNodeIds: [10],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 203,
                name: '203',
                coordinate: {
                    lat: 33.59578276005378,
                    lng:  130.21801829338074,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.21778762340546, 33.5956487092632],
                            [130.21809875965118, 33.59573807648007],
                            [130.2180451154709, 33.59581403854161],
                            [130.21771252155304, 33.59572467140345],
                            [130.21778762340546, 33.5956487092632],
                        ],
                    ],
                },
                gateNodeIds: [10],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 204,
                name: '204',
                coordinate: {
                    lat: 33.59572020304411,
                    lng: 130.21786272525787,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.21778762340546, 33.5956487092632],
                            [130.21809875965118, 33.59573807648007],
                            [130.2180451154709, 33.59581403854161],
                            [130.21771252155304, 33.59572467140345],
                            [130.21778762340546, 33.5956487092632],
                        ],
                    ],
                },
                gateNodeIds: [10],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 205,
                name: '205',
                coordinate: {
                    lat: 33.59608213940053,
                    lng: 130.2190965414047,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.21902680397034, 33.59601511426391],
                            [130.21922528743744, 33.59601511426391],
                            [130.21922528743744, 33.59609107608145],
                            [130.21902680397034, 33.59609107608145],
                            [130.21902680397034, 33.59601511426391],
                        ],
                    ],
                },
                gateNodeIds: [10],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 206,
                name: '206',
                coordinate: {
                    lat: 33.59616703783212,
                    lng:  130.21910190582275,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.21902680397034, 33.59601511426391],
                            [130.21922528743744, 33.59601511426391],
                            [130.21922528743744, 33.59609107608145],
                            [130.21902680397034, 33.59609107608145],
                            [130.21902680397034, 33.59601511426391],
                        ],
                    ],
                },
                gateNodeIds: [10],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 207,
                name: '207',
                coordinate: {
                    lat: 33.59619384784579,
                    lng: 130.2189463376999,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.21879076957703, 33.596117886118755],
                            [130.21895706653595, 33.596117886118755],
                            [130.21895706653595, 33.59622512618452],
                            [130.218785405159, 33.5962117211836],
                            [130.21879076957703, 33.596117886118755],
                        ],
                    ],
                },
                gateNodeIds: [10],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 208,
                name: '208',
                coordinate: {
                    lat: 33.596153632822144,
                    lng: 130.21888196468353,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.21879076957703, 33.596117886118755],
                            [130.21895706653595, 33.596117886118755],
                            [130.21895706653595, 33.59622512618452],
                            [130.218785405159, 33.5962117211836],
                            [130.21879076957703, 33.596117886118755],
                        ],
                    ],
                },
                gateNodeIds: [10],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 209,
                name: 'JouhouGakusyuu_1',
                coordinate: {
                    lat: 33.59613575947229,
                    lng: 130.21857619285583,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.21841526031494, 33.59605979769412],
                            [130.2187478542328, 33.59609107608145],
                            [130.2187317609787, 33.5962117211836],
                            [130.21839916706085, 33.596171506168304],
                            [130.21841526031494, 33.59605979769412],
                        ],
                    ],
                },
                gateNodeIds: [10],
                detailMapIds: [],
                lastViewedDetailMapId: null,
                others: {},
            },
            {
                id: 210,
                name: 'JouhouGakusyuu_2',
                coordinate: {
                    lat: 33.59605979769412,
                    lng: 130.21809875965118,
                },
                shape: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [130.21800756454468, 33.595974899156964],
                            [130.21827042102814, 33.59605086100992],
                            [130.21823823451996, 33.59614469614769],
                            [130.2179753780365, 33.59608213940053],
                            [130.21800756454468, 33.595974899156964],
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
                lat: 33.596314492804154,
                lng: 130.2175408601761,
            },
            botR: {
                lat: 33.59563530417269,
                lng: 130.2193433046341,
            },
        },
    },
];
