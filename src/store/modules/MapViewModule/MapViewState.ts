import { RawMap, DisplayLevelType, RawSpot } from '@/store/types';
import { sampleMaps } from '@/store/modules/sampleMaps';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import MapDataConverter from '@/utils/MapDataConverter';

/**
 * RawMap型をMap型に変換する
 * @param RawMapData RawMap型
 * @return Map型
 */
export function createMapInstance(mapData: RawMap): Map {
    const mapInstance = new Map(
        mapData.id,
        mapData.name,
        mapData.bounds,
        mapData.floorName,
    );
    return mapInstance;
}

/**
 * RawSpot型をSpot型に変換する
 * @param RawSpotData RawSpot型
 * @return Spot型
 */
export function createSpotInstance(spotData: RawSpot): Spot {
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
 * RawMapを受けとり、Mapクラス、Spotクラスの木構造を返す。
 * rootMapId = 0を利用してrootMapのMapインスタンスを返す。
 * @param mapData 地図データ(RawMapの配列)
 * @return rootマップのインスタンス
 */
export function initMap(rawMaps: RawMap[]): Map {
    if (rawMaps.length === 0) {
        throw new Error('This map is empty.');
    }
    const mapDict: {[mapId: number]: Map} = {};
    for (const rawMap of rawMaps) {
        mapDict[rawMap.id] = createMapInstance(rawMap);
    }
    for (const rawMap of rawMaps) {
        const parentMap: Map = mapDict[rawMap.id];
        for (const rawSpot of rawMap.spots) {
            const spot: Spot = createSpotInstance(rawSpot);
            const detailMaps: Map[] = rawSpot.detailMapIds
                .map((id: number) => mapDict[id]);
            spot.setParentMap(parentMap);
            spot.addDetailMaps(detailMaps);
        }
    }
    return mapDict[0];
}

export class MapViewState {
    /**
     * - 単体テスト以外の目視テスト等のために
     *   外部モジュールのsampleMapsで初期化
     */
    public rootMap: Map = initMap(sampleMaps);
    // MapDataConverterの動作確認用
    // initMapsからの木構造をjsonに変換->木に再変換
    // public rootMap: Map =
    //     MapDataConverter.json2tree(MapDataConverter.tree2json(initMap(sampleMaps)));

    /**
     * Mapコンポーネントで選択されているスポット
     */
    public focusedSpot: Spot | undefined = undefined;

    /**
     * SpotInfoコンポーネントの表示非表示状態を保持
     */
    public spotInfoIsVisible: boolean = false;

    /**
     * - 画面上で表示されている
     * - 半径〇〇内で最も画面中央に近い
     * - 詳細マップを持っている
     * スポット保持する変数
     * 条件に当てはまるスポットがない場合nullを持つ
     */
    public centerSpotInRootMap: Spot | null = null;

    /**
     * ズームレベルに応じて切り替わる表示レベルを保持
     */
    public displayLevel: DisplayLevelType = 'default';

    /**
     * マップ表示の中心の移動先のスポット
     */
    public spotToDisplayInMapCenter: Spot | null = this.rootMap.getSpots()[0];
}
