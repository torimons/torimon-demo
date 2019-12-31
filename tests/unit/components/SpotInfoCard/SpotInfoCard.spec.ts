import { createLocalVue, mount } from '@vue/test-utils';
import SpotInfoCard from '@/components/SpotInfoCard/index.vue';
import { testMapViewState } from '../../../resources/testMapViewState';
import { mapViewGetters, mapViewMutations } from '@/store';
import { cloneDeep } from 'lodash';
import Vuetify from 'vuetify';
import { MapViewState } from '@/store/types';

const mapViewStoreTestData: MapViewState = {
    maps: [
        {
            id: 0,
            name: 'Kyudai',
            spots: [
                {
                    id: 0,
                    name: 'SougouGakusyuPlaza',
                    coordinate: {
                        lat: 0,
                        lng: 0,
                    },
                    shape: {
                        type: 'Polygon',
                        coordinates: [[[]]],
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
                        coordinates: [[[]]],
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
                        coordinates: [[[]]],
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

describe('SpotInfoコンポーネントのテスト', () => {
    let localVue: any;
    let wrapper: any;
    let vuetify: any;

    beforeEach(() => {
        vuetify = new Vuetify();
        localVue = createLocalVue();
        localVue.use(Vuetify);
        wrapper = mount( SpotInfoCard, {
            localVue,
            vuetify,
        });
        const mapViewState = cloneDeep(mapViewStoreTestData);
        mapViewMutations.setMapViewState(mapViewState);
    });

    it('選択されているスポットの切り替えを検知するとコンポーネントの表示内容が変化する(others+descriptionが定義されている場合)', () => {
        const mapId: number = 0;
        const spotId: number = 0;
        mapViewMutations.setFocusedSpot({mapId, spotId});
        const expectedSpotName: string = 'SougouGakusyuPlaza';
        const expectedDescription: string = '総合学習プラザです';
        expect(wrapper.vm.name).toBe(expectedSpotName);
        expect(wrapper.vm.description).toBe(expectedDescription);
    });

    it('選択されているスポットの切り替えを検知するとコンポーネントの表示内容が変化する(descriptionが定義されていない場合)', () => {
        const mapId: number = 0;
        const spotId: number = 1;
        mapViewMutations.setFocusedSpot({mapId, spotId});
        const expectedSpotName: string = 'West2';
        const expectedDescription: string = '';
        expect(wrapper.vm.name).toBe(expectedSpotName);
        expect(wrapper.vm.description).toStrictEqual(expectedDescription);
    });

    it('選択されているスポットの切り替えを検知するとコンポーネントの表示内容が変化する(othersが定義されていない場合)', () => {
        const mapId: number = 1;
        const spotId: number = 0;
        mapViewMutations.setFocusedSpot({mapId, spotId});
        const expectedSpotName: string = '101';
        const expectedDescription: string = '';
        expect(wrapper.vm.name).toBe(expectedSpotName);
        expect(wrapper.vm.description).toStrictEqual(expectedDescription);
    });

    it('SpotInfoIsVisibleを参照して，コンポーネントの表示/非表示を切り替える', () => {
        // 初期状態では見えない状態
        expect(wrapper.vm.isVisible).toBe(false);
        // spoInfoVisibleが変化すると切り替わる
        mapViewMutations.setSpotInfoIsVisible(true);
        expect(wrapper.vm.isVisible).toBe(true);
    });

});
