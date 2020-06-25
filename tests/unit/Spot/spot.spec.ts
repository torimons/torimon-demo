import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import { Bounds, Coordinate, Shape, SpotType } from '@/store/types';

describe('Spotクラスのgetterのテスト', () => {
    const testCoord = { lat: 0, lng: 0 };

    it('getIdのテスト', () => {
        const testSpot = new Spot(1, 'testMap', testCoord, undefined, 'testFloorName');
        const actualSpotId: number = testSpot.getId();
        const expectedSpotId = 1;
        expect(actualSpotId).toEqual(expectedSpotId);
    });

    it('getNameのテスト', () => {
        const testSpot = new Spot(1, 'testMap', testCoord, undefined, 'testFloorName');
        const actualSpotName: string = testSpot.getName();
        const expectedSpotName = 'testMap';
        expect(actualSpotName).toEqual(expectedSpotName);
    });

    it('getCoordinateのテスト', () => {
        const testSpot = new Spot(1, 'testMap', testCoord, undefined, 'testFloorName');
        const actualSpotCoord: Coordinate = testSpot.getCoordinate();
        const expectedSpotCoord = testCoord;
        expect(actualSpotCoord).toEqual(expectedSpotCoord);
    });

    it('getShapeでスポットの図形情報を取得する', () => {
        const testShape: Shape = {
            type: 'Polygon',
            coordinates: [
                [
                    [130.217816, 33.595257],
                    [130.217783, 33.595517],
                    [130.217915, 33.595558],
                    [130.217942, 33.595495],
                ],
            ],
        };
        const testSpot = new Spot(1, 'testSpot', testCoord, testShape, 'testFloorName');
        const actualSpotShape: Shape | undefined = testSpot.getShape();
        const expectedSpotShape = testShape;
        expect(actualSpotShape).toEqual(expectedSpotShape);
    });

    it('shapeが初期化されていない場合，getShapeがundefinedを返す', () => {
        const testSpot = new Spot(1, 'testSpot', testCoord, undefined, 'testFloorName');
        const actualSpotShape: Shape | undefined = testSpot.getShape();
        const expectedSpotShape = undefined;
        expect(actualSpotShape).toEqual(expectedSpotShape);
    });

    it('getFloorNameでfloorNameを取得する', () => {
        const testSpot = new Spot(1, 'testSpot', testCoord, undefined, 'testFloorName');
        const actualFloorName = testSpot.getFloorName();
        expect(actualFloorName).toBe('testFloorName');
    });

    it('floorNameが初期化されていない場合,getFloorNameがundefinedを返す', () => {
        const testSpot = new Spot(1, 'testSpot', testCoord);
        const actualSpotFloorName = testSpot.getFloorName();
        const expectedSpotFloorName = undefined;
        expect(actualSpotFloorName).toEqual(expectedSpotFloorName);
    });

    it('getTypeのテスト', () => {
        const testSpot
            = new Spot(1, 'testSpot', testCoord, undefined, 'testFloorName', undefined, undefined, 'restroom');
        const actualSpotType: SpotType = testSpot.getType();
        const expectedSpotType = 'restroom';
        expect(actualSpotType).toEqual(expectedSpotType);
    });

    it('SpotTypeがundefinedのとき、getTypeが"default"を返す', () => {
        const testSpot
            = new Spot(1, 'testSpot', testCoord, undefined, 'testFloorName', undefined, undefined, undefined);
        const actualSpotType: SpotType = testSpot.getType();
        const expectedSpotType = 'default';
        expect(actualSpotType).toEqual(expectedSpotType);
    });

    it('shouldDisplayNameOnMapのテスト', () => {
        const testSpot
            = new Spot(1, 'testSpot', testCoord, undefined, 'testFloorName', undefined, undefined, 'restroom', false);
        const actual: boolean = testSpot.shouldDisplayNameOnMap();
        expect(actual).toEqual(false);
    });

    it('shouldDisplayNameOnMapがundefinedの時trueを返す', () => {
        const testSpot
            = new Spot(1, 'testSpot', testCoord, undefined, 'testFloorName', undefined, undefined, 'restroom');
        const actual: boolean = testSpot.shouldDisplayNameOnMap();
        expect(actual).toEqual(true);
    });

    it('getIconNameのテスト', () => {
        const testSpot
            = new Spot(1, 'testSpot', testCoord, undefined, 'testFloorName', undefined, undefined, 'restroom');
        const actualIconName: string = testSpot.getIconName();
        const expectedIconName = 'wc';
        expect(actualIconName).toEqual(expectedIconName);
    });

    it('setNameのテスト', () => {
        const testSpot
            = new Spot(1, 'testSpot', testCoord);
        const expectedSpotName = 'expectedSpotName';
        testSpot.setName(expectedSpotName);
        const actualSpotName: string = testSpot.getName();
        expect(actualSpotName).toEqual(expectedSpotName);
    });

    it('setDescriptionのテスト', () => {
        const testSpot
            = new Spot(1, 'testSpot', testCoord);
        const expectedDescription = 'expectedDescription';
        testSpot.setDescription(expectedDescription);
        const actualDescription = testSpot.getDescription();
        expect(actualDescription).toEqual(expectedDescription);
    });

    it('setShouldDisplayNameOnMapのテスト', () => {
        const testSpot
            = new Spot(1, 'testSpot', testCoord, undefined, 'testFloorName', undefined, undefined, 'restroom', false);
        testSpot.setShouldDisplayNameOnMap(true);
        const actual: boolean = testSpot.shouldDisplayNameOnMap();
        expect(actual).toEqual(true);
    });
});
