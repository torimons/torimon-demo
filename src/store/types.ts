/**
 * MapViewコンポーネントの状態の情報を持つ型
 */
export interface MapViewState {
    maps: Map[];
    rootMapId: number;
    focusedSpotId: number;
    focusedMapId: number;
    spotInfoIsVisible: boolean;
}

/**
 * マップの情報を持つ型
 */
export interface Map {
    id: number;
    name: string;
    spots: Spot[];
    bounds: Bounds;
    parentSpotId?: number;
}

/**
 * スポットの情報全てを表す型
 */
export interface Spot {
    id: number;
    name: string;
    location: Location;
    floor: number;
    /**
     * GeoJSONのジオメトリオブジェクトのJSON構造
     * [GeoJSON フォーマット仕様](https://s.kitazaki.name/docs/geojson-spec-ja.html#id5)
     */
    shape?: {
        'type': 'Polygon' | 'MultiPolygon',
        'coordinates': number[][][] | number[][][][],
    };
    gateNodeIds: number[];
    parentSpotIds: number[];
    detailMapId?: number;
    others?: any;
}


/**
 * SpotInfoコンポーネントで使うSpotの情報を表すための型
 */
export interface SpotInfo {
    name: string;
    floor: number;
    others?: any;
}

/**
 * Mapコンポーネント上でスポットのアイコンを表示するために必要な情報を持つ型
 */
export interface SpotForMap {
    id: number;
    name: string;
    location: Location;
    floor: number;
}

/**
 * 地図上の範囲を左上と右下の座標で示す型
 */
export interface Bounds {
    topL: Location;
    botR: Location;
}

/**
 * 座標を示す型
 */
export interface Location {
    lat: number;
    lng: number;
}
