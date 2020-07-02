import Map from '@/Map/Map.ts';
import Spot from '@/Spot/Spot.ts';
import { initMap } from '@/store/modules/MapViewModule/MapViewState.ts';
import { Coordinate, Shape, Bounds } from '@/store/types';
import { MapJson, SpotJson } from '@/store/types';

export default class MapDataConverter {
    /**
     * jsonをMap, Spot型の木構造に変換する
     * @param json
     * @retutn 木構造の根のMapインスタンス
     */
    public static json2tree(mapJson: MapJson): Map {
        return this.createMap(mapJson);
    }

    /**
     * Map, Spot型の木構造からjsonに変換する
     * @param rootMap 根のMapインスタンス
     * @return 木構造に変換したjson
     */
    public static tree2json(rootMap: Map): any {
        return rootMap.toJSON();
    }

    /**
     * 再帰的にjsonからインスタンスを復元する
     * 引数のjsonからMapを作成し，spotsをcreateSpotに投げる
     * @param json jsonのstring
     * @return Mapインスタンス
     */
    private static createMap(mapJson: MapJson): Map {
        // jsonの根っこからマップインスタンスを作成，
        // spotsはcreateSpotに投げる
        const map = new Map(
            mapJson.id,
            mapJson.name,
            mapJson.bounds,
            mapJson.floorName,
            mapJson.description,
        );
        if (mapJson.spots !== undefined) {
            // spotsはこの時点ではまだJson
            const spots: SpotJson[] = mapJson.spots;
            const spotInstances: Spot[] = spots.map(
                (spot: any) => this.createSpot(spot),
            );
            // spotが存在する場合のみ登録処理
            if (spotInstances.length > 0) {
                map.addSpots(spotInstances);
            }
        }
        return map;
    }

    /**
     * 再帰的にjsonからインスタンスを復元する
     * 引数のjsonからSpotを作成し，detailMapsをcreateMapに投げる
     * @param json jsonのstring
     * @return Spotインスタンス
     */
    private static createSpot(spotJson: SpotJson): Spot {
        // jsonの根っこからマップインスタンスを作成，
        // detailMapsはcreateMapに投げる
        const spot = new Spot(
            spotJson.id,
            spotJson.name,
            spotJson.coordinate,
            spotJson.shape,
            spotJson.floorName,
            spotJson.description,
            spotJson.attachment,
            spotJson.type,
        );
        if (spotJson.detailMaps !== undefined) {
            // detailMapsはこの時点ではJson
            const detailMaps: MapJson[] = spotJson.detailMaps;
            const mapInstances: Map[] = detailMaps.map(
                (m: any) => this.createMap(m),
            );
            // detailMapsがある場合のみ登録処理を行う
            if (mapInstances.length > 0) {
                spot.addDetailMaps(mapInstances);
            }
        }
        return spot;
    }

}
