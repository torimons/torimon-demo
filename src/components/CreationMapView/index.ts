import { Component, Vue } from 'vue-property-decorator';
import 'leaflet/dist/leaflet.css';
import L, { LeafletEvent, Marker } from 'leaflet';
import { Coordinate, SpotType } from '@/store/types';
import { mapViewGetters } from '@/store';
import Map from '@/Map/Map.ts';
import EditorToolBar from '@/components/EditorToolBar/index.vue';
import Spot from '@/Spot/Spot';
import DefaultSpotMarker from '@/components/MapView/Marker/DefaultSpotMarker';

@Component({
    components: {
        EditorToolBar,
    },
})
export default class CreationMapView extends Vue {
    private lMap!: L.Map;
    private defaultZoomLevel: number = 17;
    private tileLayer!: L.TileLayer;
    private map: Map = new Map(0, 'New Map', {
        topL: {lat: 0, lng: 0},
        botR: {lat: 0, lng: 0},
    });
    // 次にクリックしたときに設置されるスポットタイプ
    private spotTypeToAddNext: SpotType = 'default';

    /**
     * とりあえず地図の表示を行なっています．
     */
    public mounted() {
        const rootMapCenter: Coordinate = Map.calculateCenter(mapViewGetters.rootMap.getBounds());
        this.lMap = L.map('map', {zoomControl: false})
            .setView([rootMapCenter.lat, rootMapCenter.lng], this.defaultZoomLevel);
        this.tileLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 23,
                maxNativeZoom: 19,
            },
        ).addTo(this.lMap);
        this.lMap.on('click', this.on);
    }

    public setAddSpotMethodOnMapClick(spotType: SpotType): void {
        this.onMapClick = this.addSpot;
        this.spotTypeToAddNext = spotType;
    }

    public setEmptyMethodOnMapClick(): void {
        this.onMapClick = (e: any) => undefined;
    }

    public on(e: any): void {
        this.onMapClick(e);
    }

    public addSpot(e: any): void {
        const maxNumOfId = this.map.getSpots()
            .map((spot) => spot.getId())
            .reduce((accum, newValue) => Math.max(accum, newValue), -1);
        const newId = maxNumOfId + 1;
        const newSpot: Spot = new Spot(
            newId, 'Spot ' + newId, e.latlng, undefined, undefined, undefined, undefined, this.spotTypeToAddNext,
        );
        this.map.addSpots([newSpot]);
        const newMarker: Marker = new DefaultSpotMarker(newSpot);
        newMarker.addTo(this.lMap);
    }

    public zoomIn() {
        this.lMap.zoomIn();
    }

    public zoomOut() {
        this.lMap.zoomOut();
    }

    private onMapClick: (e: any) => void = (e: any) => undefined;
}
