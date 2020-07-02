import { Coordinate, Shape, SpotJson, SpotType } from '@/store/types.ts';
import Map from '@/Map/Map.ts';

export default class Spot {
    private parentMap!: Map;
    private detailMaps: Map[] = [];
    private lastViewedDetailMap: Map | undefined = undefined;

    constructor(
            private id: number,
            private name: string,
            private coordinate: Coordinate,
            private shape?: Shape,
            private floorName?: string,
            private description?: string,
            private attachment?: [{name: string, url: string}],
            private type?: SpotType ) {
        /* 何もしない */
    }

    /**
     * 自身のidを返す
     * @return 自身のid
     */
    public getId(): number {
        return this.id;
    }

    /**
     * スポットのnameを返す
     * @return スポットのname
     */
    public getName(): string {
        return this.name;
    }

    /**
     * 自身の座標を返す
     * @return 自身の座標
     */
    public getCoordinate(): Coordinate {
        return this.coordinate;
    }

    /**
     * スポットの図形情報を返す
     * @return 図形情報
     */
    public getShape(): Shape | undefined {
        return this.shape;
    }

    /**
     * スポットのnameを返す
     * @return スポットのname
     */
    public getFloorName(): string | undefined {
        return this.floorName;
    }


    /**
     * 詳細マップを返す
     * @return 詳細マップ
     */
    public getDetailMaps(): Map[] {
        return this.detailMaps;
    }

    /**
     * 自身の説明を返す
     * @return description
     */
    public getDescription(): string | undefined {
        return this.description;
    }

    /**
     * 自身のアタッチメントを返す
     * @return attachment，なければundefined
     */
    public getAttachment(): [{name: string, url: string}] | undefined {
        return this.attachment;
    }

    /**
     * スポットのtypeを返す
     * @return スポットのtype, undefinedの場合'default'を返す
     */
    public getType(): SpotType {
        if (this.type === undefined) {
            return 'default';
        }
        return this.type;
    }

    /**
     * スポットのアイコン名を返す
     * @return アイコン名, 存在しない場合'place'アイコン
     */
    public getIconName(): string {
        const iconNameMaps: Array<{ key: SpotType, iconName: string }> = [
            { key: 'default',       iconName: 'place' },
            { key: 'withDetailMap', iconName: 'add_location' },
            { key: 'restroom',      iconName: 'wc' },
        ];
        const iconName = iconNameMaps.find((iconNameMap) => iconNameMap.key === this.getType())?.iconName;
        if (iconName === undefined) {
            throw new Error('Illegal implements of "iconNameMaps".');
        }
        return iconName;
    }

    /**
     * 親マップが存在すれば親マップを返す
     * @return 親マップ、存在しない場合undefined
     */
    public getParentMap(): Map | undefined {
        return this.parentMap;
    }

    /**
     * 親マップの親スポットを取得する
     * @return parentSpot
     */
    public getParentSpot(): Spot | undefined {
        return this.parentMap.getParentSpot();
    }

    /**
     * 親mapをセットし,セットしたmapの子spotに自身を追加する.
     * @param parentMap セットする親map
     */
    public setParentMap(parentMap: Map): void {
        if (this.hasParentMap(parentMap)) {
            return;
        }
        this.parentMap = parentMap;
        this.floorName = parentMap.getFloorName();
        parentMap.addSpots([this]);
    }

    /**
     * 詳細mapを追加し,追加した詳細mapにparentSpotとして自身をセットする.
     * すでに追加済みであれば追加しない.
     * @param detailMaps 追加する詳細マップの配列
     */
    public addDetailMaps(detailMaps: Map[]): void {
        for (const detailMap of detailMaps) {
            if (this.hasDetailMap(detailMap)) {
                continue;
            }
            this.detailMaps.push(detailMap);
            detailMap.setParentSpot(this);
        }
        // lastViewedDetailMapの初期化
        if (this.lastViewedDetailMap === undefined && detailMaps.length > 0) {
            this.lastViewedDetailMap = detailMaps[0];
        }
    }

    /**
     * parentMapとして引数のmapを持っているか判定する
     * @param map 判定対象のmap
     * @return mapがparentMapであるならばtrue, そうでなければfalse
     */
    public hasParentMap(map: Map): boolean {
        return this.parentMap === map;
    }

    /**
     * 最後に表示された詳細マップを返す
     * @return 最後に表示された詳細マップ
     */
    public getLastViewedDetailMap(): Map | undefined {
        return this.lastViewedDetailMap;
    }

    /**
     * 最後に表示された詳細マップを更新する
     * @param lastViewedDetailMap 最後に表示された詳細マップ
     */
    public setLastViewedDetailMap(lastViewedDetailMap: Map): void {
        this.lastViewedDetailMap = lastViewedDetailMap;
    }

    /**
     * 詳細mapがすでに登録済みかを判定する
     * @param detailMap 判定対象のmap
     * @return すでに登録済みならtrue, 未登録ならばfalse
     */
    public hasDetailMap(detailMap: Map): boolean {
        return this.detailMaps.includes(detailMap);
    }

    /**
     * 指定したidをもつ子孫スポットを探す
     * @param id 指定するid
     * @return 該当するスポット，またはnull
     */
    public findSpot(id: number): Spot | null {
        if (this.id === id) {
            return this;
        }
        for (const map of this.detailMaps) {
            const foundSpot: Spot | null = map.findSpot(id);
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
        for (const map of this.detailMaps) {
            const foundMap: Map | null = map.findMap(id);
            if (foundMap !== null) {
                return foundMap;
            }
        }
        return null;
    }

    /**
     * JSON.stringifyの引数に渡された時に呼ばれる
     * プロパティをオブジェクトに入れて返す
     * detailMapsプロパティは再起的にtoJSONを呼び出す
     * @return プロパティを入れたオブジェクト
     */
    public toJSON(): SpotJson {
        return {
            id: this.id,
            name: this.name,
            coordinate: this.coordinate,
            shape: this.shape,
            floorName: this.floorName,
            description: this.description,
            attachment: this.attachment,
            type: this.type,
            detailMaps: this.detailMaps.map((m: Map) => m.toJSON()),
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
     * 検索条件を満たすかを判定する際の文字列を作成する
     * スポットで検索対象になるのは
     * - スポット自身の名前
     * - 親マップの名前
     * - 親マップの親スポットの名前
     * - desctiption
     * の4つ
     */
    private generateSearchTargetString(): string {
        let searchTargetString: string = this.name;
        const parentMap: Map | undefined = this.parentMap;
        if (parentMap !== undefined) {
            const parentSpot = parentMap.getParentSpot();
            if (parentSpot !== undefined) {
                searchTargetString += parentSpot.getName();
            }
        }
        if (this.description !== undefined) {
            searchTargetString += this.description;
        }
        return searchTargetString;
    }
}
