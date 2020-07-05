import Spot from '@/Spot/Spot.ts';
import { Bounds, Coordinate, MapJson } from '@/store/types';

export default class Map {
    /**
     * 地図上の範囲から中心の座標を計算
     * TODO: 本クラスのインスタンスが現在取得できないので一時的にpublic staticにしてアクセス
     * @param bounds 中心座標を計算したい地図の範囲
     * @return 中心座標
     */
    public static calculateCenter(bounds: Bounds): Coordinate {
        const centerLat = (bounds.topL.lat + bounds.botR.lat) / 2;
        const centerLng = (bounds.topL.lng + bounds.botR.lng) / 2;
        return { lat: centerLat, lng: centerLng };
    }

    private parentSpot: Spot | undefined = undefined;
    private spots: Spot[] = [];

    constructor(
        private id: number,
        private name: string,
        private bounds: Bounds,
        private floorName?: string,
        private description?: string,
    ) {
    }

    /**
     * 自身のidを返す
     * @return 自身のid
     */
    public getId(): number {
        return this.id;
    }

    /**
     * マップの名前を返す
     * @return マップ名
     */
    public getName(): string {
        return this.name;
    }

    /**
     * マップが持つスポットを返す
     * @return スポットの配列
     */
    public getSpots(): Spot[] {
        return this.spots;
    }

    /**
     * マップが表現する範囲を返す
     * @return マップの範囲
     */
    public getBounds(): Bounds {
        return this.bounds;
    }

    /**
     * マップのdescriptionを返す
     * @return description，存在しなければundefined
     */
    public getDescription(): string | undefined {
        return this.description;
    }

    /**
     * 親スポットが存在すれば親スポットを返す
     * @return 親スポット．存在しない場合undefined
     */
    public getParentSpot(): Spot | undefined {
        return this.parentSpot;
    }

    /**
     * 親spotをセットし,セットしたspotのdetailMapに自身を追加する.
     * @param parentSpot セットする親スポット
     */
    public setParentSpot(parentSpot: Spot): void {
        if (this.hasParentSpot(parentSpot)) {
            return;
        }
        this.parentSpot = parentSpot;
        parentSpot.addDetailMaps([this]);
    }

    /**
     * spotを追加し,追加したspotのparentMapとして自身をセットする.
     * すでに追加済みであれば追加しない.
     * @param spots 追加するspotの配列
     */
    public addSpots(spots: Spot[]): void {
        for (const spot of spots) {
            if (this.hasSpot(spot)) {
                continue;
            }
            this.spots.push(spot);
            spot.setParentMap(this);
        }
    }

    /**
     * parentSpotとして引数のspotを持っているか判定する
     * @param spot 判定対象のspot
     * @return spotがparentSpotであるならばtrue, そうでなければfalse
     */
    public hasParentSpot(spot: Spot): boolean {
        return this.parentSpot === spot;
    }

    /**
     * spotがすでに登録済みかを判定する
     * @param spot 判定対象のspot
     * @return すでに登録済みならtrue, 未登録ならばfalse
     */
    public hasSpot(spot: Spot): boolean {
        return this.spots.includes(spot);
    }

    /**
     * floorNameを返す
     * @return 階層名
     */
    public getFloorName(): string | undefined {
        return this.floorName;
    }

    /**
     * 指定したidをもつ子孫スポットを探す
     * @param id 指定するid
     * @return 該当するスポット，またはnull
     */
    public findSpot(id: number): Spot | null {
        for (const spot of this.spots) {
            const foundSpot: Spot | null = spot.findSpot(id);
            if (foundSpot !== null) {
                return foundSpot;
            }
        }
        return null;
    }

    /**
     * 指定したidをもつ子孫マップを探す
     * @param id 指定するid
     * @return 該当するマップ，またはnull
     */
    public findMap(id: number): Map | null {
        if (this.id === id) {
            return this;
        }
        for (const spot of this.spots) {
            const foundMap: Map | null = spot.findMap(id);
            if (foundMap !== null) {
                return foundMap;
            }
        }
        return null;
    }

    /**
     * JSON.stringifyの引数に渡された時に呼ばれる
     * プロパティをオブジェクトに入れて返す
     * spotsプロパティは再起的にtoJSONを呼び出す
     * @return プロパティを入れたオブジェクト
     */
    public toJSON(): MapJson {
        return {
            id: this.id,
            name: this.name,
            bounds: this.bounds,
            floorName: this.floorName,
            description: this.description,
            spots: this.spots.map((s: Spot) => s.toJSON()),
        };
    }

    /*
     * 検索条件を満たすかを判定する
     * @param regExp 正規表現オブジェクト
     * @return bool値，検索対象文字列が正規表現にマッチするか否か
     */
    public isMatchToRegExp(regExp: RegExp): boolean {
       // RegExp.test(target:str)は、targetにRegExpがマッチした場合にtrue, マッチしない場合falseを返す.
        return regExp.test(this.generateSearchTargetString());
    }

    /**
     * 検索対象を満たすかを判定する際の文字列を生成する
     * マップクラスで検索対象になるのは
     * - マップ自身の名前
     * - desctiption
     * の2つ
     * @return 検索対象文字列
     */
    private generateSearchTargetString(): string {
        if (this.description === undefined) {
            return this.name;
        }
        return this.name + this.description;
    }
}
