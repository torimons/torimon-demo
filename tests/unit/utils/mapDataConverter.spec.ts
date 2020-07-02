import MapDataConverter from '@/utils/MapDataConverter';
import { sampleMaps } from '@/store/modules/sampleMaps';
import { initMap } from '@/store/modules/MapViewModule/MapViewState';
import Map from '@/Map/Map.ts';
import { before } from 'lodash';
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
        };
        // 変換
        const actualInstance = (MapDataConverter as any).createMap(testJson);
        const actualProperties = {
            id: (actualInstance as any).id,
            name: (actualInstance as any).name,
            bounds: (actualInstance as any).bounds,
            floorName: (actualInstance as any).floorName,
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
        };
        // 変換
        const actualInstance = (MapDataConverter as any).createSpot(testJson);
        const actualProperties = {
            id: (actualInstance as any).id,
            name: (actualInstance as any).name,
            coordinate: (actualInstance as any).coordinate,
            shape: (actualInstance as any).shape,
            floorName: (actualInstance as any).floorName,
            description: (actualInstance as any).description,
            attachment: (actualInstance as any).attachment,
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
