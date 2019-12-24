import L, {Marker, LatLngExpression} from 'leaflet';
import { GeolocationWrapper } from './components/GeolocationWrapper';

export default class CurrentLocationMarker extends L.Marker {
    private icon: L.Icon = L.icon({
        iconUrl: 'https://github.com/torimons/torimon/blob/master/public/leaflet/icons/currentLocation.png?raw=true',
        iconSize: [40, 40],
        iconAnchor: [25, 25],
        popupAnchor: [0, 0],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
        className: 'currentLocation',
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
