import { RawMap, DisplayLevelType, RawSpot } from '@/store/types';
import { sampleMaps } from '@/store/modules/sampleMaps';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

/**
 * 旧
 * マップ中の全スポットに階層情報と親のスポットの名前を登録する
 * 階層や親スポットが存在しない場合,初期化を行わないと
 * SpotItemコンポーネントでundefinedが表示されることになるので
 * 空文字列を代入しておく
 * @return 情報追加後のマップ
 */
function initMaps(): RawMap[] {
    for (const map of sampleMaps) {
        for (const spot of map.spots) {
            spot.mapId = map.id;
            spot.parentSpotName = '';
            spot.floorName = '';
        }
    }
    for (const map of sampleMaps) {
        for (const spot of map.spots) {
            for (const detailMapId of spot.detailMapIds) {
                const detailMap = sampleMaps.find((m: RawMap) => m.id === detailMapId);
                if (detailMap === undefined) {
                    throw new Error('Illegal map id on sampleMaps.');
                }
                for (const detailMapSpot of detailMap.spots) {
                    detailMapSpot.parentSpotName = spot.name;
                    const detailMapIdIndex: number = spot.detailMapIds
                        .findIndex((id: number) => id === detailMapId);
                    detailMapSpot.floorName = spot.detailMapLevelNames[detailMapIdIndex];
                }
            }
        }
    }
    return sampleMaps;
}

/**
 * RawMap型をMap型に変換する
 * @param RawMapData RawMap型
 * @return Map型
 */
export function createMapInstance(mapData: RawMap): Map{
    const mapInstance = new Map(
        mapData.id,
        mapData.name,
        mapData.bounds,
    );
    return mapInstance; 
}

/**
 * RawSpot型をSpot型に変換する
 * @param RawSpotData RawSpot型
 * @return Spot型
 */
export function createSpotInstance(spotData: RawSpot): Spot{
    const spotInstance = new Spot(
        spotData.id,
        spotData.name,
        spotData.coordinate,
        spotData.shape,
        spotData.floorName,
        spotData.description,
        spotData.attachment,
    );
    return spotInstance; 
}
/**
 * 新 表示・検索機能が対応し次第こちらを使用
 * RawMapを受けとり、Mapクラス、Spotクラスの木構造を返す。
 * rootMapId = 0を利用してrootMapのMapインスタンスを作る
 * @param mapData 地図データ(RawMapの配列)
 * @return  木構造の地図データ
 */

export function toMapTree(mapData: RawMap[]): Map {
    if (mapData.length === 0) {
        throw new Error('空配列です');
    }
    const rootMapData = mapData[0];
    const rootMap = createMapInstance(rootMapData);
    for (const spotData of rootMapData.spots) {
        const spot = createSpotInstance(spotData);
        rootMap.addSpots([spot]);
        spot.setParentMap(rootMap);
        for (const detailMapId of spotData.detailMapIds) {
            const RawDetailMap = mapData.find((m: RawMap) => m.id === detailMapId);
            if (RawDetailMap === undefined) {
                throw new Error('Illegal map id on sampleMaps.');
            }
            const detailMap = createMapInstance(RawDetailMap);
            spot.addDetailMaps([detailMap]);
            detailMap.setParentSpot(spot);
            for (const detailMapSpotData of RawDetailMap.spots) {
                const detailSpotData = createSpotInstance(detailMapSpotData);
                detailMap.addSpots([detailSpotData]);
                detailSpotData.setParentMap(detailMap);
            }
        }
    }
    return rootMap;
}

export class MapViewState {
    /**
     * 複数のマップの情報を持つ
     * - 大元の地図と各スポットの持つ
     *   詳細地図(ピンチインで出てくるやつ)など含む
     * - 単体テスト以外の目視テスト等のために
     *   外部モジュールのsampleMapsで初期化
     * 将来的にはvuexのmutationで登録する
     */
    public maps: RawMap[] = initMaps();
    /**
     * 新
     */
    // public maps: Map = initMapsVer2();

    /*
     * 大元の親のMapのID
     */
    public rootMapId: number = 0;

    /**
     * Mapコンポーネントで選択されているMap，およびスポットのID
     */
    public focusedSpot: {mapId: number, spotId: number} = {
        mapId: -1,
        spotId: -1,
    };

    /**
     * SpotInfoコンポーネントの表示非表示状態を保持
     */
    public spotInfoIsVisible: boolean = false;

    /**
     * - 画面上で表示されている
     * - 半径〇〇内で最も画面中央に近い
     * - 詳細マップを持っている
     * スポットのIDを保持する変数
     * 条件に当てはまるスポットがない場合nullを持つ
     */
    public idOfCenterSpotInRootMap: number | null = null;

    /**
     * ズームレベルに応じて切り替わる表示レベルを保持
     */
    public displayLevel: DisplayLevelType = 'default';

    /**
     * マップ表示の中心の移動先のスポット
     */
    public spotToDisplayInMapCenter: { mapId: number, spotId: number } = { mapId: 0, spotId: 0 };
}
