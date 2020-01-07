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
    private spotIds!: {mapId: number, spotId: number};

    constructor(latlng: LatLngExpression, spotIds: {mapId: number, spotId: number}) {
        super(latlng);
        this.setIcon(this.icon);
        this.spotIds = spotIds;
    }

    public addTo(map: L.Map | L.LayerGroup<any>): this {
        return super.addTo(map).on('click', this.getFocusedMarker);
    }
    /**
     * マーカーが押されたときに押されたマーカーのmapIdとspotIdをsetFocusedMarkerに渡す
     * @param e
     */
    private getFocusedMarker(e: L.LeafletEvent): void {
        this.setFocusedMarker(e.target.spotIds);
    }
    /**
     * マーカーが押された時に呼び出されるコールバック関数
     */
    private setFocusedMarker(spotIds: {mapId: number, spotId: number}): void {
        mapViewMutations.setFocusedSpot(spotIds);
        mapViewMutations.setSpotInfoIsVisible(true);
    }
}
