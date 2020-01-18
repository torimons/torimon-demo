import L, {Marker, LatLngExpression, LeafletEvent} from 'leaflet';
import { mapViewMutations } from '@/store';
import { MapViewState } from '@/store/modules/MapViewModule/MapViewState';

export default class DefaultSpotMarker extends L.Marker {
    private mapId: number;
    private spotId: number;
    private normalColor: string = '#3F8373';
    private selectedColor: string = '#AE56B3';
    private icon: L.DivIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin"></div><i class="material-icons" style="font-size:48px; color:${this.normalColor};">room</i>`,
        iconAnchor: [24, 50],
    });
    private isSelected: boolean = false;

    constructor(latlng: LatLngExpression, mapId: number, spotId: number) {
        super(latlng);
        this.setIcon(this.icon);
        this.mapId = mapId;
        this.spotId = spotId;
    }

    /**
     * マーカーのmapIdとspotIdを返す
     * @returns 自身のmapId, spotId
     */
    public getIdInfo(): {mapId: number, spotId: number} {
        return {mapId: this.mapId, spotId: this.spotId};
    }

    public addTo(map: L.Map | L.LayerGroup<any>): this {
        return super.addTo(map).on('click', this.updateFocusedMarker);
    }

    /**
     * マーカーの選択状態によって色を切り替える
     * @param isSelected true/false
     */
    public setSelected(isSelected: boolean): void {
        this.isSelected = isSelected;
        const color = isSelected ? this.selectedColor : this.normalColor;
        const htmlTemplate =
            `<div class="marker-pin"></div><i class="material-icons" style="font-size:48px; color:${color};">room</i>`;
        const icon = L.divIcon({
            className: 'custom-div-icon',
            html: htmlTemplate,
            iconAnchor: [24, 50],
        });
        this.setIcon(icon);
    }

    /**
     * マーカーが押されたときに呼び出されるコールバック関数
     */
    private updateFocusedMarker(): void {
        mapViewMutations.setFocusedSpot({mapId: this.mapId, spotId: this.spotId});
        mapViewMutations.setSpotInfoIsVisible(true);
    }
}
