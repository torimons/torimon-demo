import { Component, Vue } from 'vue-property-decorator';
import 'leaflet/dist/leaflet.css';
import L, { LeafletEvent, Marker } from 'leaflet';
import { Coordinate } from '@/store/types';
import { mapViewGetters } from '@/store';
import Map from '@/Map/Map.ts';
import EditorToolBar from '@/components/EditorToolBar/index.vue';
import Spot from '@/Spot/Spot';
import DefaultSpotMarker from '../MapView/Marker/DefaultSpotMarker';

@Component({
    components: {
        EditorToolBar,
    },
})
export default class CreationMapView extends Vue {
    private map!: L.Map;
    private defaultZoomLevel: number = 17;
    private tileLayer!: L.TileLayer;

    /**
     * とりあえず地図の表示を行なっています．
     */
    public mounted() {
        const rootMapCenter: Coordinate = Map.calculateCenter(mapViewGetters.rootMapBounds);
        this.map = L.map('map', {zoomControl: false})
            .setView([rootMapCenter.lat, rootMapCenter.lng], this.defaultZoomLevel);
        this.tileLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 23,
                maxNativeZoom: 19,
            },
        ).addTo(this.map);
        this.map.on('click', this.onMapClick);
    }

    public onMapClick(e: any): void {
        const newSpot: Spot = new Spot(0, 'Spot', e.latlng);
    }

    public zoomIn() {
        this.map.zoomIn();
    }

    public zoomOut() {
        this.map.zoomOut();
    }
}
