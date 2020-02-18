import { Coordinate, Shape } from '@/store/types.ts';
import Map from '@/Map/Map.ts';

export default class Spot {
    private parentMap: Map | undefined = undefined;
    private detailMaps: Map[] = [];

    constructor(private id: number,
                private name: string,
                private coordinate: Coordinate,
                private shape?: Shape,
                private floorName?: string,
                private description?: string,
                private attachment?: [{name: string, url: string}]) {
    }

    /**
     * 親マップを登録する
     * @params 登録する子スポット
     * @errors 親マップがすでに登録されている場合エラーを送出する
     */
    public registerParentMap(parentMap: Map) {
        if (this.parentMap === undefined) {
            this.parentMap = parentMap;
        } else {
            throw new Error('ParentMap is already registered');
        }
    }

    /**
     * 詳細マップを追加する
     * @params 追加する詳細マップの配列
     */
    public appendDetailMaps(detailMaps: Map[]) {
        detailMaps.map((map) => this.detailMaps.push(map));
    }
}
