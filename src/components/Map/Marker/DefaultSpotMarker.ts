import L, {LatLngExpression} from 'leaflet';
import { mapViewMutations, mapViewGetters } from '@/store';

export default class DefaultSpotMarker extends L.Marker {
    private mapId: number;
    private spotId: number;
    private spotName!: string;
    private normalColor: string = '#3F8373';
    private selectedColor: string = '#AE56B3';
    private nameLabelMarker!: L.Marker;
    private icon: L.DivIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin"></div><i class="material-icons" style="font-size:48px; color:${this.normalColor};">room</i>`,
        iconAnchor: [24, 50],
    });

    constructor(latlng: LatLngExpression, spotName: string, mapId: number, spotId: number) {
        super(latlng);
        this.setIcon(this.icon);
        this.spotName = spotName;
        this.mapId = mapId;
        this.spotId = spotId;
        this.createNameLabelMarker(latlng);
        // マーカー生成時にfocusedSpotの場合選択状態にしておく
        const focusedSpot = mapViewGetters.focusedSpot;
        if (focusedSpot.mapId === mapId && focusedSpot.spotId === spotId) {
            this.setSelected(true);
        }
    }

    public addTo(map: L.Map | L.LayerGroup<any>): this {
        this.nameLabelMarker.addTo(map);
        return super.addTo(map).on('click', this.updateFocusedMarker);
    }

    public remove(): this {
        this.nameLabelMarker.remove();
        return super.remove();
    }

    /**
     * マーカーのmapIdとspotIdを返す
     * @returns 自身のmapId, spotId
     */
    public getIdInfo(): {mapId: number, spotId: number} {
        return {mapId: this.mapId, spotId: this.spotId};
    }
    /**
     * マーカーの選択状態によって色を切り替える
     * @param isSelected true/false
     */
    public setSelected(isSelected: boolean): void {
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
     * スポットの下に表示するラベルマーカーを作成する(addはmapから呼ばれる)
     * @param latlng スポットの座標
     */
    private createNameLabelMarker(latlng: LatLngExpression): void {
        const fontSize: number = 14;
        const widthRate: number = fontSize * 5 / 3;
        // だいたいfont-size:12のときwidthはString.length * 15くらいがちょうどいい
        const htmlTemplate =
            `<div
                style="width:${Math.round(this.spotName.length * widthRate)}px;font-size:${fontSize}px;"
            >${this.spotName}</div>`;
        const nameLabelIcon = L.divIcon({
            className: 'name-label',
            html: htmlTemplate,
            iconAnchor: [(this.spotName.length - 1) * widthRate / 3, 0],
        });
        this.nameLabelMarker = L.marker(latlng, {icon: nameLabelIcon});
    }


    /**
     * マーカーが押されたときに呼び出されるコールバック関数
     */
    private updateFocusedMarker(): void {
        mapViewMutations.setFocusedSpot({mapId: this.mapId, spotId: this.spotId});
        mapViewMutations.setSpotInfoIsVisible(true);
    }
}
