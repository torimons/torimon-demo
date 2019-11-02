/**
 * MapViewの状態を表す型
 * stateにおいて最も上の親にあたる
 */
export interface MapViewState {
    map: MapState;
    spotInfoIsVisible: boolean;
}

/**
 * 表示しているマップの情報を持つ型
 */
export interface MapState {
    id: number;
    name: string;
    currentSpotId: number;
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
    gateNodeIds: number[];
    parentSpotIds: number[];
    detailMapId?: number;
    others?: any;
}

/**
 * SpotInfoコンポーネントで使うSpotの情報を表すための型
 * NOTE: 何を持たせればいいかあまり分からず．idはいるのか？
 */
export interface SpotInfo {
    id: number;
    name: string;
    floor: number;
    detailMapId?: number;
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
