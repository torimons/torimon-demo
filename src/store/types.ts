export interface RootState {
    version: string;
}

/**
 * MapViewの状態を表す型
 * stateにおいて最も上の親にあたる
 */
export interface MapViewState {
    map: MapState;
    spotInfoIsVisible: false;
}

/**
 * 表示しているマップの情報を持つ型
 */
export interface MapState {
    id: number;
    name: string;
    currentSpotID: number;
    spots: Spot[];
    bounds: Bounds;
    parentSpotId?: number;
}

/**
 * スポットの情報全てを表す型
 */
export interface Spot {
    id: number;
    name : string;
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
 * 
 */
export interface Bounds {
    topL: Location;
    botR: Location;
}

export interface Location {
    lat: number;
    lng: number;
}
