import { Component, Prop, Vue } from 'vue-property-decorator';
import 'leaflet/dist/leaflet.css';
import L, { Marker } from 'leaflet';
import { SpotForMap, Bounds, RawSpot, DisplayLevelType, Coordinate } from '@/store/types';
import { mapViewGetters } from '@/store';


@Component
export default class CreationMapView extends Vue {
    private map!: L.Map;
    private defaultZoomLevel: number = 17;
    private tileLayer!: L.TileLayer;

    /**
     * とりあえず地図の表示を行なっています．
     */
    public mounted() {
        const rootMapCenter: Coordinate = this.calculateCenter(mapViewGetters.rootMapBounds);
        this.map = L.map('creation-map-view').setView([rootMapCenter.lat, rootMapCenter.lng], this.defaultZoomLevel);
        this.tileLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 23,
                maxNativeZoom: 19,
            },
        ).addTo(this.map);
        this.map.zoomControl.setPosition('bottomright');
    }

    /**
     * 地図上の範囲から中心の座標を計算
     * @param bounds 中心座標を計算したい地図の範囲
     * @return 中心座標
     */
    private calculateCenter(bounds: Bounds): Coordinate {
        const centerLat = (bounds.topL.lat + bounds.botR.lat) / 2;
        const centerLng = (bounds.topL.lng + bounds.botR.lng) / 2;
        return { lat: centerLat, lng: centerLng };
    }

}
