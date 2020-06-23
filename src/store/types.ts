
/**
 * MapViewコンポーネントの状態の情報を持つ型
 */
export interface MapViewState {
    maps: RawMap[];
    rootMapId: number;
    focusedSpot: {
        mapId: number,
        spotId: number,
    };
    spotInfoIsVisible: boolean;
    displayLevel: DisplayLevelType;
    idOfCenterSpotInRootMap: number | null;
    spotToDisplayInMapCenter: { mapId: number, spotId: number };
}

/**
 * マップの情報を持つ型
 */
export interface RawMap {
    id: number;
    name: string;
    floorName?: string;
    spots: RawSpot[];
    nodes: Node[];
    edges: Edge[];
    bounds: Bounds;
    parentSpotId?: number;
}

/**
 * スポットの情報全てを表す型
 */
export interface RawSpot {
    id: number;
    mapId?: number;
    name: string;
    parentSpotName?: string;
    floorName?: string;
    coordinate: Coordinate;
    /**
     * GeoJSONのジオメトリオブジェクトのJSON構造
     * [GeoJSON フォーマット仕様](https://s.kitazaki.name/docs/geojson-spec-ja.html#id5)
     */
    shape?: Shape;
    gateNodeIds: number[];
    detailMapIds: number[];
    detailMapLevelNames: string[];
    lastViewedDetailMapId: number | null;
    description?: string;
    attachment?: [
        {
            name: string,
            url: string,
        }
    ];
    type?: SpotType;
    shouldDisplayNameOnMap?: boolean;
}


/**
 * SpotInfoコンポーネントで使うSpotの情報を表すための型
 */
export interface SpotInfo {
    name: string;
    description: string;
    attachment: [
        {
            name: string,
            url: string,
        }
    ];
}

/**
 * Mapコンポーネント上でスポットのアイコンを表示するために必要な情報を持つ型
 */
export interface SpotForMap {
    mapId: number;
    spotId: number;
    name: string;
    coordinate: Coordinate;
    shape?: Shape;
}

/**
 * 地図上の範囲を左上と右下の座標で示す型
 */
export interface Bounds {
    topL: Coordinate;
    botR: Coordinate;
}

/**
 * 座標を示す型
 */
export interface Coordinate {
    lat: number;
    lng: number;
}

export interface Shape {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
}

/*
 * ノードの情報を示す型
 */
export interface Node {
    id: number;
    mapId: number;
    spotId: number;
    coordinate: Coordinate;
}

/*
 * エッジの情報を示す型
 */
export interface Edge {
    id: number;
    nodeIds: {A: number, B: number};
    distance: number;
}

/**
 * ズームレベルで切り替わる表示レベルの種類
 */
export type DisplayLevelType = 'default' | 'detail';

/**
 * スポットの種別
 * withDetailMap: 詳細マップ持ちスポット
 * restroom: トイレ
 */
export type SpotType = 'default' | 'withDetailMap' | 'restroom';
