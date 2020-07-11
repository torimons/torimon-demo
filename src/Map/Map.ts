import Spot from '@/Spot/Spot.ts';
import { Bounds, Coordinate, MapJson } from '@/store/types';

export default class Map {

    private parentSpot: Spot | undefined = undefined;
    private spots: Spot[] = [];
    private _id: string | undefined;

    constructor(
        private id: number,
        private name: string,
        private bounds: Bounds,
        private floorName?: string,
        private description?: string,
    ) {
    }

    /**
     * mongodbから与えられた固有idを返す
     */
    public getDBId(): string | undefined {
        return this._id;
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
     * 地図上の範囲から中心の座標を計算
     * @param bounds 中心座標を計算したい地図の範囲
     * @return 中心座標
     */
    public getCenter(): Coordinate {
        const centerLat = (this.bounds.topL.lat + this.bounds.botR.lat) / 2;
        const centerLng = (this.bounds.topL.lng + this.bounds.botR.lng) / 2;
        return { lat: centerLat, lng: centerLng };
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
     * マップの範囲をセットする
     * @param bounds マップの範囲
     */
    public setBounds(bounds: Bounds): void {
        this.bounds = bounds;
    }

    /**
     * spotを追加し,追加したspotのparentMapとして自身をセットする.
     * すでに追加済みであれば追加しない.
     * @param spots 追加するspot
     */
    public addSpot(spot: Spot): void {
        if (this.hasSpot(spot)) {
            return;
        }
        this.spots.push(spot);
        spot.setParentMap(this);
    }

    /**
     * 複数のspotを追加し,追加したspotのparentMapとして自身をセットする.
     * すでに追加済みのスポットは追加しない.
     * @param spots 追加するspotの配列
     */
    public addSpots(spots: Spot[]): void {
        for (const spot of spots) {
            this.addSpot(spot);
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
     * 指定したidをもつスポットを削除
     * @param id 指定するid
     */
    public removeSpot(id: number): void {
        this.spots = this.spots.filter((spot) => spot.getId() !== id);
    }

    /**
     * 新しいidを登録する
     * @param newMapId 登録する新しいid
     */
    public setId(newMapId: number) {
        this.id = newMapId;
    }

    /**
     * 新しい名前を登録
     * @param newName 新しい名前
     */
    public setName(newName: string) {
        this.name = newName;
    }

    /**
     * 新しいdescriptionを登録
     * @param newDescription 新しいdescription
     */
    public setDescription(newDescription: string) {
        this.description = newDescription;
    }

    /**
     * monogodbから与えられた固有idをセットする
     * (コンストラクタで渡すと変更箇所が多く影響範囲が多いのでとりあえず)
     */
    public setDBId(_id: string) {
        this._id = _id;
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

    /**
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
