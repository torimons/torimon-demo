import L, {LatLngExpression} from 'leaflet';
import { mapViewMutations, mapViewGetters } from '@/store';
import Spot from '@/Spot/Spot';
import { SpotType } from '@/store/types';

export default class SpotMarker extends L.Marker {
    private spot: Spot;
    private normalColor: string = '#3F8373';
    private selectedColor: string = '#AE56B3';
    private nameLabelMarker!: L.Marker;
    private iconName: string = 'place';

    constructor(spot: Spot) {
        super(spot.getCoordinate());
        this.iconName = spot.getIconName();
        const icon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="marker-pin"></div><i class="material-icons" style="font-size:48px; color:${this.normalColor};">${this.iconName}</i>`,
            iconAnchor: [24, 50],
        });
        this.setIcon(icon);
        this.spot = spot;
        // マーカー生成時にfocusedSpotの場合選択状態にしておく
        const focusedSpot = mapViewGetters.focusedSpot;
        if (focusedSpot === spot) {
            this.setSelected(true);
        }
    }

    public addTo(map: L.Map | L.LayerGroup<any>): this {
        this.remove();
        if (this.spot.shouldDisplayNameOnMap()) {
            this.createNameLabelMarker(this.spot.getCoordinate());
            this.nameLabelMarker.addTo(map);
        }
        return super.addTo(map).on('click', this.updateFocusedMarker);
    }

    public remove(): this {
        if (this.nameLabelMarker !== undefined) {
            this.nameLabelMarker.remove();
        }
        return super.remove();
    }

    /**
     * マーカーの示すスポットを返す
     * @returns スポット
     */
    public getSpot(): Spot {
        return this.spot;
    }
    /**
     * マーカーの選択状態によって色を切り替える
     * @param isSelected true/false
     */
    public setSelected(isSelected: boolean): void {
        const color = isSelected ? this.selectedColor : this.normalColor;
        const htmlTemplate =
            `<div class="marker-pin"></div><i class="material-icons" style="font-size:48px; color:${color};">${this.iconName}</i>`;
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
                    style="width:${Math.round(this.spot.getName().length * widthRate)}px;font-size:${fontSize}px;"
                >${this.spot.getName()}</div>`;
        const nameLabelIcon = L.divIcon({
            className: 'name-label',
            html: htmlTemplate,
            iconAnchor: [(this.spot.getName().length - 1) * widthRate / 3, 0],
        });
        this.nameLabelMarker = L.marker(latlng, {icon: nameLabelIcon});
    }


    /**
     * マーカーが押されたときに呼び出されるコールバック関数
     */
    private updateFocusedMarker(): void {
        mapViewMutations.setFocusedSpot(this.spot);
        mapViewMutations.setSpotInfoIsVisible(true);
    }
}
