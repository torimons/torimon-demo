export interface RootState {
    version: string,   
}

export interface MapState{
    id: string,
    name : string,
    currentSpotID: string,
    spot: Spot[]
    bounds: {
        top_l: Location, 
        bot_r: Location, 
    },
    parent_spot_id: string,
}

export interface Spot {
    id: string,
    name : string,
    location: Location, 
    floor: number,
    gate_node_ids: string[],
    parent_spot_ids: string[],
    detail_map_id: string,
    others: any,
}

export interface Location {
    lat: number, 
    lng: number, 
}