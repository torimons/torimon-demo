import L, {Marker, LatLngExpression, LeafletEvent} from 'leaflet';
import { mapViewMutations } from '@/store';
import { MapViewState } from '@/store/modules/MapViewModule/MapViewState';

export default class DefaultSpotMarker extends L.Marker {
    private icon: L.Icon = L.icon({
        iconUrl: 'https://github.com/torimons/torimon/blob/master/public/leaflet/icons/marker-icon-2x.png?raw=true',
        iconSize: [50, 82],
        iconAnchor: [25, 80],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
    });
    private mapId: number;
    private spotId: number;

    constructor(latlng: LatLngExpression, mapId: number, spotId: number) {
        super(latlng);
        this.setIcon(this.icon);
        this.mapId = mapId;
        this.spotId = spotId;
    }

    public addTo(map: L.Map | L.LayerGroup<any>): this {
        return super.addTo(map).on('click', this.updateFocusedMarker);
    }
    /**
     * マーカーが押されたときに呼び出されるコールバック関数
     * @param e
     */
    private updateFocusedMarker(e: L.LeafletEvent): void {
        this.setFocusedMarker(e.target.mapId, e.target.spotId);
    }
    /**コールバック関数内で呼び出される関数
     * @param mapId
     * @param spotId
     */
    private setFocusedMarker(mapId: number, spotId: number): void {
        mapViewMutations.setFocusedSpot({mapId, spotId});
        mapViewMutations.setSpotInfoIsVisible(true);
    }
}
