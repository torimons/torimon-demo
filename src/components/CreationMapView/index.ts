import { Component, Vue } from 'vue-property-decorator';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Coordinate } from '@/store/types';
import { mapViewGetters } from '@/store';
import Map from '@/Map/Map.ts';

@Component
export default class CreationMapView extends Vue {
    private map!: L.Map;
    private defaultZoomLevel: number = 17;
    private tileLayer!: L.TileLayer;

    /**
     * とりあえず地図の表示を行なっています．
     */
    public mounted() {
        const rootMapCenter: Coordinate = Map.calculateCenter(mapViewGetters.rootMapBounds);
        this.map = L.map('creation-map-view').setView([rootMapCenter.lat, rootMapCenter.lng], this.defaultZoomLevel);
        this.tileLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 23,
                maxNativeZoom: 19,
            },
        ).addTo(this.map);
        this.map.zoomControl.setPosition('bottomright');
    }
}
