import L, {LatLngExpression} from 'leaflet';
import { mapViewMutations, mapViewGetters } from '@/store';
import Spot from '@/Spot/Spot';
import { SpotType } from '@/store/types';

export default class DefaultSpotMarker extends L.Marker {
    private spot: Spot;
    private spotName!: string;
    private normalColor: string = '#3F8373';
    private selectedColor: string = '#AE56B3';
    private nameLabelMarker!: L.Marker;
    private iconName: string = 'place';
    private iconNameMaps: Array<{ key: SpotType, iconName: string }> = [
        { key: 'default', iconName: 'place' },
        { key: 'withDetailMap', iconName: 'add_location' },
        { key: 'restroom', iconName: 'wc' },
    ];
    private icon: L.DivIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin"></div><i class="material-icons" style="font-size:48px; color:${this.normalColor};">${this.iconName}</i>`,
        iconAnchor: [24, 50],
    });

    constructor(spot: Spot) {
        super(spot.getCoordinate());
        const iconName = this.iconNameMaps.find((iconNameMap) => iconNameMap.key === spot.getType())?.iconName;
        if (iconName !== undefined) {
            this.iconName = iconName;
        } else {
            this.iconName = 'default';
        }
        this.setIcon(this.icon);
        this.spotName = spot.getName();
        this.spot = spot;
        this.createNameLabelMarker(spot.getCoordinate());
        // マーカー生成時にfocusedSpotの場合選択状態にしておく
        const focusedSpot = mapViewGetters.focusedSpot;
        if (focusedSpot === spot) {
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
        let htmlTemplate;
        // スポットがrootMapに属していなければスポットの名前を表示する
        if (this.spot.getParentMap() !== mapViewGetters.rootMap) {
            htmlTemplate =
                `<div
                    style="width:${Math.round(this.spotName.length * widthRate)}px;font-size:${fontSize}px;"
                >${this.spotName}</div>`;
        } else {
            htmlTemplate = '';
        }
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
        mapViewMutations.setFocusedSpot(this.spot);
        mapViewMutations.setSpotInfoIsVisible(true);
    }
}
