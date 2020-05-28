import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import { Bounds, Coordinate, Shape } from '@/store/types';

describe('Spotクラスのgetterのテスト', () => {
    const testCoord = { lat: 0, lng: 0 };

    it('getIdのテスト', () => {
        const testSpot = new Spot(1, 'testMap', testCoord, undefined, 'testFloorName');
        const actualSpotId: number = testSpot.getId();
        const expectSpotId = 1;
        expect(actualSpotId).toEqual(expectSpotId);
    });

    it('getNameのテスト', () => {
        const testSpot = new Spot(1, 'testMap', testCoord, undefined, 'testFloorName');
        const actualSpotName: string = testSpot.getName();
        const expectSpotName = 'testMap';
        expect(actualSpotName).toEqual(expectSpotName);
    });

    it('getCoordinateのテスト', () => {
        const testSpot = new Spot(1, 'testMap', testCoord, undefined, 'testFloorName');
        const actualSpotCoord: Coordinate = testSpot.getCoordinate();
        const expectSpotCoord = testCoord;
        expect(actualSpotCoord).toEqual(expectSpotCoord);
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
        const expectSpotShape = testShape;
        expect(actualSpotShape).toEqual(expectSpotShape);
    });

    it('shapeが初期化されていない場合，getShapeがundefinedを返す', () => {
        const testSpot = new Spot(1, 'testMap', testCoord, undefined, 'testFloorName');
        const actualSpotShape: Shape | undefined = testSpot.getShape();
        const expectSpotShape = undefined;
        expect(actualSpotShape).toEqual(expectSpotShape);
    });

    it('getFloorNameでfloorNameを取得する', () => {
        const testSpot = new Spot(1, 'testMap', testCoord, undefined, 'testFloorName');
        const actualFloorName = testSpot.getFloorName();
        expect(actualFloorName).toBe('testFloorName');
    });

    it('floorNameが初期化されていない場合,getFloorNameがundefinedを返す', () => {
        const testSpot = new Spot(1, 'testMap', testCoord);
        const actualSpotFloorName = testSpot.getFloorName();
        const expectSpotFloorName = undefined;
        expect(actualSpotFloorName).toEqual(expectSpotFloorName);
    });
});
