import { mapViewGetters, mapViewMutations } from '@/store/newMapViewIndex.ts';
import map from '@/components/MapView/index.vue';
import { MapViewState } from '@/store/types';
import { FeatureCollection } from 'geojson';
import { shallowMount } from '@vue/test-utils';
import { cloneDeep } from 'lodash';
import { testRawMapData } from '../../../resources/testRawMapData';
import { GeolocationWrapper } from '@/components/MapView/GeolocationWrapper';
import Spot from '@/Spot/Spot';

// const mapViewStateTestData: MapViewState = cloneDeep(testMapViewState);

const expectedGeoJsonObject: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
        {
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
        },
        {
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
        },
    ],
};


describe('mapコンポーネントのポリゴン表示', () => {
    let wrapper: any;
    beforeEach(() => {
        // テスト用データをstoreにセット
        mapViewMutations.setRootMapForTest(testRawMapData);
        GeolocationWrapper.watchPosition = jest.fn();
        const initMapDisplay = jest.fn();
        const watchStoreForDisplayMap = jest.fn();
        wrapper = shallowMount( map, {
            attachToDocument: true,
            methods: {
                initMapDisplay,
                watchStoreForDisplayMap,
            },
        });
    });

    it('spotのshape情報をgeoJson形式に変換する', () => {
        const spots: Spot[] = mapViewGetters.rootMap.getSpots();
        const actualGeoJsonFormat =  wrapper.vm.spotShapeToGeoJson(spots);
        const expectedGeoJsonFormat = expectedGeoJsonObject;
        expect(actualGeoJsonFormat).toStrictEqual(expectedGeoJsonFormat);
    });

});
