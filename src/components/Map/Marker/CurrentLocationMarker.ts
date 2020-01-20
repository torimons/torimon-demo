import L, {Marker, LatLngExpression} from 'leaflet';
import { GeolocationWrapper } from '../GeolocationWrapper';

export default class CurrentLocationMarker extends L.Marker {
    private icon: L.DivIcon = L.divIcon({
        className: 'custom-div-icon',
        html:
            '<div class="marker-pin"></div><i class="material-icons" style="font-size:48px; color:#736020;">person_pin</i>',
        iconAnchor: [24, 50],
    });

    constructor(latlng: LatLngExpression) {
        super(latlng);
        this.setIcon(this.icon);
        this.bindMarkerToCurrentPosition();
    }

    /**
     * マーカーがデバイスの現在位置に常に表示されるようにする
     */
    private bindMarkerToCurrentPosition(): number {
        return GeolocationWrapper.watchPosition(
            (pos: Position) => {
                this.setLatLng(
                    [pos.coords.latitude, pos.coords.longitude],
                );
            },
            (error: PositionError) => {
                throw error;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000, // milliseconds
                maximumAge: 0, // 0 = the device cannot use a cached position
            },
        );
    }

}
