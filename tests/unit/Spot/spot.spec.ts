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
        const testSpot = new Spot(1, 'testMap', testCoord, testShape, 'testFloorName');
        const actualSpotShape: Shape | undefined = testSpot.getShape();
        const expectedSpotShape = testShape;
        expect(actualSpotShape).toEqual(expectedSpotShape);
    });

    it('shapeが初期化されていない場合，getShapeがundefinedを返す', () => {
        const testSpot = new Spot(1, 'testMap', testCoord, undefined, 'testFloorName');
        const actualSpotShape: Shape | undefined = testSpot.getShape();
        const expectedSpotShape = undefined;
        expect(actualSpotShape).toEqual(expectedSpotShape);
    });

    it('getFloorNameでfloorNameを取得する', () => {
        const testSpot = new Spot(1, 'testMap', testCoord, undefined, 'testFloorName');
        const actualFloorName = testSpot.getFloorName();
        expect(actualFloorName).toBe('testFloorName');
    });

    it('floorNameが初期化されていない場合,getFloorNameがundefinedを返す', () => {
        const testSpot = new Spot(1, 'testMap', testCoord);
        const actualSpotFloorName = testSpot.getFloorName();
        const expectedSpotFloorName = undefined;
        expect(actualSpotFloorName).toEqual(expectedSpotFloorName);
    });

    it('getTypeのテスト', () => {
        const testSpot
            = new Spot(1, 'testMap', testCoord, undefined, 'testFloorName', undefined, undefined, 'restroom');
        const actualSpotType: SpotType = testSpot.getType();
        const expectedSpotType = 'restroom';
        expect(actualSpotType).toEqual(expectedSpotType);
    });

    it('SpotTypeがundefinedのとき、getTypedefaultを返す', () => {
        const testSpot
            = new Spot(1, 'testMap', testCoord, undefined, 'testFloorName', undefined, undefined, undefined);
        const actualSpotType: SpotType = testSpot.getType();
        const expectedSpotType = 'default';
        expect(actualSpotType).toEqual(expectedSpotType);
    });
});
