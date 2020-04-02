import { RawMapData, DisplayLevelType, RawSpotData } from '@/store/types';
import { sampleMaps } from '@/store/modules/sampleMaps';
import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';

/**
 * マップ中の全スポットに階層情報と親のスポットの名前を登録する
 * 階層や親スポットが存在しない場合,初期化を行わないと
 * SpotItemコンポーネントでundefinedが表示されることになるので
 * 空文字列を代入しておく
 * @return 情報追加後のマップ
 */

/**
 * インスタンス生成時にRawMapDataから受け取った情報を入れる。
 * return  RawMapDataを受けてMapクラス、Spotクラスの木構造を返す。
 */ 
function initMaps(): RawMapData[] {
    /**
     * rootMapId = 0を利用してrootMapのMapインスタンスを作る
     * rootMapのスポットを追加する
     * for (rootMapの各スポット) {
     *    detailMapIdを取得，そのIdのマップインスタンスを作って今みているspotのMapに追加する
     *    spotをMapに追加
     * }
    */
    const rootMapData = sampleMaps[0];
    const rootMap = new Map(rootMapData.id, rootMapData.name, rootMapData.bounds, );
    for (const spot of rootMapData.spots) {
        const spotData = new Spot(spot.id, spot.name, spot.coordinate,spot.shape, spot.floorName, spot.description,spot.attachment);
        rootMap.addSpots([spotData]);
        spotData.setParentMap(rootMap);
        for (const detailMapId of spot.detailMapIds) {
            const detailMap = sampleMaps.find((m: RawMapData) => m.id === detailMapId);
            if (detailMap === undefined) {
                throw new Error('Illegal map id on sampleMaps.');
            }
            const childMapData = new Map(detailMap.id, detailMap.name, detailMap.bounds, );
            spotData.addDetailMaps([childMapData]);
            childMapData.setParentSpot(spotData);
            for (const detailMapSpot of detailMap.spots){
                const childSpotData = 
                new Spot(detailMapSpot.id, detailMapSpot.name, detailMapSpot.coordinate, detailMapSpot.shape, detailMapSpot.floorName, detailMapSpot.description,spot.attachment);
                childMapData.addSpots([childSpotData]);
                childSpotData.setParentMap(childMapData);
            }
        }
    }
    return rootMap;
}


    // // Mapクラスの親のset、Spotクラスの子のaddを行う。
    // for (const map of sampleMaps) {
    //     for (const spot of map.spots) {
    //         for (const detailMapId of spot.detailMapIds) {
    //             const detailMap = sampleMaps.find((m: RawMapData) => m.id === detailMapId);
    //             if (detailMap === undefined) {
    //                 throw new Error('Illegal map id on sampleMaps.');
    //             }
    //             for (const detailMapSpot of detailMap.spots) {
    //                 detailMapSpot.parentSpotName = spot.name;
    //                 const detailMapIdIndex: number = spot.detailMapIds
    //                     .findIndex((id: number) => id === detailMapId);
    //                 detailMapSpot.floorName = spot.detailMapLevelNames[detailMapIdIndex];
    //             }
    //         }
    //     }
    // }

export class MapViewState {
    /**
     * 複数のマップの情報を持つ
     * - 大元の地図と各スポットの持つ
     *   詳細地図(ピンチインで出てくるやつ)など含む
     * - 単体テスト以外の目視テスト等のために
     *   外部モジュールのsampleMapsで初期化
     * 将来的にはvuexのmutationで登録する
     */
    public maps: RawMapData[] = initMaps();


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
