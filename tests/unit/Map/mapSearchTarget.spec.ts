import Spot from '@/Spot/Spot.ts';
import Map from '@/Map/Map.ts';

describe('Mapの検索対象文字列のテスト', () => {
    const rootMap: Map = new Map(
        0,
        'rootMap',
        {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}},
        undefined,
        'this is test description',
    );
    const rootMapNoDescription: Map = new Map(
        0,
        'rootMap',
        {topL: {lat: 0, lng: 0}, botR: {lat: 0, lng: 0}},
    );

    it('descriptionありのMapの検索対象文字列は自身の名前とdescriptionになる', () => {
        const expectedString = rootMap.getName() + rootMap.getDescription();
        expect((rootMap as any).generateSearchTargetString()).toBe(expectedString);
    });

    it('descriptionなしのMapの検索対象文字列は自身の名前のみになる', () => {
        const expectedString = rootMapNoDescription.getName();
        expect((rootMapNoDescription as any).generateSearchTargetString()).toBe(expectedString);
    });
});
