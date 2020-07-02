import MapDataConverter from '@/utils/MapDataConverter';
import { sampleMaps } from '@/store/modules/sampleMaps';
import { initMap } from '@/store/modules/MapViewModule/MapViewState';
import Map from '@/Map/Map.ts';
import { before } from 'lodash';
import { MapJson, SpotJson } from '@/store/types';
// import axios from 'axios';

describe('MapDataConverterのテスト', () => {

    // json-serverとの連携を試す時に使ってください
    // it('apiから取得して変換するテスト(確認用)', (done) => {
    //     let res;
    //     axios.get('http://localhost:3000/maps/0').then((response) => {
    //         res = response;
    //         console.log(res.data);
    //         const conv = MapDataConverter.json2tree(res.data);
    //         console.log(conv);
    //         console.log((conv as any).spots[0]);
    //         done();
    //     });
    // });

    it('createMapでJsonのプロパティとMapインスタンスのプロパティが一致する', () => {
        const testBounds = {
            topL: {lat: 123, lng: 10},
            botR: {lat: 132, lng: 5},
        };
        // 変換するjsonオブジェクト
        const testJson = {
            id: 0,
            name: 'testMap',
            bounds: testBounds,
            floorName: '1F',
            description: 'test description',
        };
        // 変換
        const actualInstance: MapJson = (MapDataConverter as any).createMap(testJson);
        const actualProperties = {
            id: actualInstance.id,
            name: actualInstance.name,
            bounds: actualInstance.bounds,
            floorName: actualInstance.floorName,
            description: actualInstance.description,
        };
        expect(actualProperties).toStrictEqual(testJson);
    });

    it('createSpotでJsonのプロパティとSpotインスタンスのプロパティが一致する', () => {
        const testCoord = { lat: 123, lng: 10 };
        // 変換するjsonオブジェクト
        const testJson = {
            id: 0,
            name: 'testSpot',
            coordinate: testCoord,
            shape: {
                type: 'Polygon',
                coordinates: [[
                    [0.0, 0.0],
                    [1.0, 1.0],
                ]],
            },
            floorName: '1F',
            description: 'this is test spot',
            attachment: [],
            type: 'default',
        };
        // 変換
        const actualInstance: SpotJson = (MapDataConverter as any).createSpot(testJson);
        const actualProperties = {
            id: actualInstance.id,
            name: actualInstance.name,
            coordinate: actualInstance.coordinate,
            shape: actualInstance.shape,
            floorName: actualInstance.floorName,
            description: actualInstance.description,
            attachment: actualInstance.attachment,
            type: actualInstance.type,
        };
        expect(actualProperties).toStrictEqual(testJson);
    });

    it('json2treeがMapのインスタンスを返す', () => {
        // mock
        (MapDataConverter as any).createSpot = jest.fn(
            (json) => new Map(0, 'testMap', {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}}),
        );
        const testJson: any = {test: 0};
        expect(MapDataConverter.json2tree(testJson)).toBeInstanceOf(Map);
    });
});
