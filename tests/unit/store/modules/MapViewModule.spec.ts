import { mapViewStore } from '@/store/modules/MapViewModule';
import { MapState, Bounds, SpotInfo, SpotForMap} from '@/store/types';

const expectedMapState: MapState = {
    id: 0,
    name: 'SougouGakusyuPlaza',
    currentSpotId: 1,
    spots: [
        {
            id: 0,
            name: '101',
            location: {
                lat: 33.5954558,
                lng: 130.2179447,
            },
            floor: 1,
            gateNodeIds: [0],
            parentSpotIds: [],
        },
        {
            id: 1,
            name: '102',
            location: {
                lat: 33.595525,
                lng: 130.2181244,
            },
            floor: 1,
            gateNodeIds: [1],
            parentSpotIds: [],
        },
    ],
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
};

const expectedSpotInfoIsVisible: boolean = true;

describe('components/SpotInfo.vue', () => {
    beforeEach(() => {
        // stateを入力するためにテスト用のmutationsを用意するしかなかった
        // 直接stateをモックしたり入力にできないか調べたい
        mapViewStore.setMapState(expectedMapState);
        mapViewStore.setSpotInfoIsVisible(expectedSpotInfoIsVisible);
    });

    it('stateに登録したSpotInfoコンポーネントの表示状態をgetterで取得する', () => {
        const spotInfoIsVisible: boolean = mapViewStore.spotInfoIsVisible;
        expect(spotInfoIsVisible).toEqual(expectedSpotInfoIsVisible);
    });

    it('stateに登録したmapのBoundsをgetterで取得する', () => {
        const mapBounds: Bounds = mapViewStore.mapBounds;
        expect(mapBounds).toEqual(expectedMapState.bounds);
    });

    it('stateに登録したSpotsからSpotForMap型の配列をgetterで取得する', () => {
        const spotsForMap: SpotForMap[] = mapViewStore.spotsForMap;
        const expectedSpotsForMap: SpotForMap[] = [
            {
                id: expectedMapState.spots[0].id,
                name: expectedMapState.spots[0].name,
                location: expectedMapState.spots[0].location,
                floor: expectedMapState.spots[0].floor,
            },
            {
                id: expectedMapState.spots[1].id,
                name: expectedMapState.spots[1].name,
                location: expectedMapState.spots[1].location,
                floor: expectedMapState.spots[1].floor,
            },
        ];
        expect(spotsForMap).toEqual(expectedSpotsForMap);
    });

    it('stateに登録したSpotsの情報からcurrentSpotIdを持つSpotのSpotInfo型の情報をgetterで取得する', () => {
        const infoOfCurrentSpot: SpotInfo = mapViewStore.infoOfCurrentSpot;
        const expectedInfoOfCurrentSpot: SpotInfo = {
            id: expectedMapState.spots[expectedMapState.currentSpotId].id,
            name: expectedMapState.spots[expectedMapState.currentSpotId].name,
            floor: expectedMapState.spots[expectedMapState.currentSpotId].floor,
        };
        expect(infoOfCurrentSpot).toEqual(expectedInfoOfCurrentSpot);
    });

    it('setterでsetしたcurrentSpotIdがmapViewStoreのstateに登録されている', () => {
        const expectedNewCurrentSpotId: number = 2;
        mapViewStore.setCurrentSpotId(expectedNewCurrentSpotId);
        expect(mapViewStore.map.currentSpotId).toBe(expectedNewCurrentSpotId);
    });

});
