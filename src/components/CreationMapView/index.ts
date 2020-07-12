import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import 'leaflet/dist/leaflet.css';
import { mapViewGetters, mapViewMutations } from '@/store';
import L, { LeafletEvent, Marker } from 'leaflet';
import { Coordinate, SpotType, Shape, Bounds } from '@/store/types';
import Map from '@/Map/Map.ts';
import EditorToolBar from '@/components/EditorToolBar/index.vue';
import SpotEditor from '@/components/SpotEditor/index.vue';
import Spot from '@/Spot/Spot';
import SpotMarker from '@/components/MapView/Marker/SpotMarker';
import ShapeEditor from './ShapeEditor';
import { cloneDeep } from 'lodash';
import MapInformationDialog from '@/components/MapInformationDialog/index.vue';
import { getBounds, isPointInPolygon } from 'geolib';

@Component({
    components: {
        EditorToolBar,
        SpotEditor,
        MapInformationDialog,
    },
})
export default class CreationMapView extends Vue {
    private lMap!: L.Map;
    private defaultZoomLevel: number = 14;
    private leafletContainer!: HTMLElement | null;
    private rootMap: Map = new Map(0, 'New Map', {
        topL: { lat: 33.596643, lng: 130.215516 },
        botR: { lat: 33.594083, lng: 130.220609 },
    });
    private mapToEdit: Map = this.rootMap;
    // 次にクリックしたときに設置されるスポットタイプ
    private spotTypeToAddNext: SpotType = 'default';
    private mapAreaSelectionInfoIsVisible: boolean = true;
    private messageWhileShapeEditing: 'クリックしてスポットの範囲を描画' | '始点をクリックして範囲選択を終了する' = 'クリックしてスポットの範囲を描画';
    private outOfMapRangeWarningIsVisible: boolean = false;
    private shapeEditButtonIsVisible: boolean = false;
    private spotButtonInEditorToolBarIsVisible: boolean = false;
    private flyToMapBoundsButtonIsVisible: boolean = false;
    private whileShapeEditing: boolean = false;
    private spotEditorIsVisible: boolean = false;
    private focusedSpot: Spot | null = null;
    private spotMarkers: SpotMarker[] = [];

    // 詳細マップ生成時に利用
    private currentId: number = 0;

    private dialog: boolean = false;
    private shapeEditor!: ShapeEditor;

    // 作成中のマップtreeviewで利用
    private items: any = [];
    private tree = [];
    private mapFileTreeDialog: boolean = false;
    private drawer: boolean = false;

    private whileMapNameEditing: boolean = false;
    private mapNameColor: string = 'background-color:#3F8373';

    /**
     * とりあえず地図の表示を行なっています．
     */
    public mounted() {
        const rootMapCenter: Coordinate = this.rootMap.getCenter();
        this.lMap = L.map('map', { zoomControl: false })
            .setView([rootMapCenter.lat, rootMapCenter.lng], this.defaultZoomLevel);
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 23,
                maxNativeZoom: 19,
            },
        ).addTo(this.lMap);
        if (document.querySelector('.leaflet-container') !== null) {
            this.leafletContainer = document.querySelector('.leaflet-container') as HTMLElement;
        }
        if (this.leafletContainer !== null) {
            this.leafletContainer.style.cursor = 'crosshair';
        }
        this.shapeEditor = new ShapeEditor(this.lMap);
        mapViewMutations.setIsMapCreated(true);
        /* 既存のマップを元に作成を始める場合 */
        if (this.$route !== undefined) { // テスト時のエラー回避
            if (this.$route.params.from === 'edit') {
                this.rootMap = mapViewGetters.rootMap;
                this.resetAllIds();
                this.rootMap.getSpots().forEach((spot) => {
                    this.displaySpotMarker(spot);
                });
                this.shapeEditor.displayPolygons(this.rootMap.getSpots());
                this.mapToEdit = this.rootMap;
                this.shapeEditor.drawRectangle(this.rootMap.getBounds());
                this.currentId = this.getNextId();
                this.initMapView();
                return;
            }
        }
        const selectMapArea = (e: any) => {
            if (!('latlng' in e)) {
                return;
            }
            e.onEndSelection = (bounds: L.LatLngBounds) => {
                this.rootMap.setBounds({
                    topL: bounds.getNorthWest(),
                    botR: bounds.getSouthEast(),
                });
                this.initMapView();
            };
            this.shapeEditor.startRectangleSelection(e);
        };
        this.lMap.on('click', (e) => selectMapArea(e));
    }

    private initMapView() {
        const zoomLevel = this.lMap.getBoundsZoom(
            new L.LatLngBounds(this.rootMap.getBounds().topL, this.rootMap.getBounds().botR), false,
        );
        this.lMap.setView(this.rootMap.getCenter(), zoomLevel);
        this.onMapClick = () => undefined;
        this.spotButtonInEditorToolBarIsVisible = true;
        this.mapAreaSelectionInfoIsVisible = false;
        this.flyToMapBoundsButtonIsVisible = true;
        if (this.leafletContainer !== null) {
            this.leafletContainer.style.removeProperty('cursor');
        }
        this.lMap.on('click', (event) => this.onMapClick(event));
    }

    private flyToMapBounds(): void {
        const bounds: Bounds = this.mapToEdit.getBounds();
        const lBounds: L.LatLngBounds = new L.LatLngBounds(bounds.topL, bounds.botR);
        this.lMap.flyToBounds(lBounds);
    }

    private focusMapNameInputForm(): void {
        if ('focus' in this.$refs.mapNameForm) {
            (this.$refs.mapNameForm as any).focus();
        }
    }

    /**
     * スポット、詳細マップの追加が行われるとtreeviewを更新する
     */
    @Watch('rootMap', {deep: true})
    private updateMapTreeView() {
        this.items = [this.mapToJson(this.rootMap)];
    }

    /**
     * treeviewで扱う形式に変換する
     * @param map 変換対象のマップ
     */
    private mapToJson(map: Map): any {
        return {
            id: map.getId(),
            name: map.getName(),
            type: 'Map',
            children: map.getSpots().map((s: Spot) => this.spotToJson(s)),
        };
    }

    /**
     * treeviewで扱う形式に変換する。
     * @param spot 変換対象のスポット
     */
    private spotToJson(spot: Spot): any {
        return {
            id: spot.getId(),
            name: spot.getName(),
            type: 'Spot',
            children: spot.getDetailMaps().map((m: Map) => this.mapToJson(m)),
        };
    }

    /**
     * マップがクリックされた時に実行されるonMapClick(メソッド型の変数)にaddSpotメソッドを代入
     * EditorToolBarコンポーネントでclickSpotイベントが発生した時に実行される
     * @param spotType クリックされたスポットの種類 (clickSpotイベントから送られてくる)
     */
    private setAddSpotMethodOnMapClick(spotType: SpotType): void {
        if (this.leafletContainer !== null) {
            this.leafletContainer.style.cursor = 'url(https://github.com/torimons/torimon/blob/create-shape-mode/src/assets/place-32px.cur?raw=true) 18 35, pointer ';
        }
        this.onMapClick = this.addSpot;
        this.spotTypeToAddNext = spotType;
    }

    /**
     * マップがクリックされた時に実行されるonMapClick(メソッド型の変数)に何も行わないundefinedを
     * セットし，クリック時に何も行われないようにする
     * EditorToolBarコンポーネントでclickSpotイベント以外が発生した時に実行される
     */
    private setDefaultMethodOnMapClick(): void {
        // マップの範囲選択時にツールバーのmoveを押してもカーソルが戻らないように.
        // これはかなり苦しい
        if (this.leafletContainer !== null && !this.mapAreaSelectionInfoIsVisible) {
            this.leafletContainer.style.removeProperty('cursor');
        }
        this.onMapClick = (e: any) => {
            this.unfocusedMarker();
        };
    }

    /**
     * スポットを作成しマーカーをL.Mapに追加する
     * 作成するスポットのIDは既存のスポットのIDの中から最も大きい数値+1の値
     * @param e Leafletイベント(e.latlngを取得するためにany型にしている)
     */
    private addSpot(e: L.LeafletMouseEvent): void {
        let isPointInMapArea: boolean;
        if (this.rootMap.getId() ===  this.mapToEdit.getId()) {
            const lBouds = new L.LatLngBounds(
                this.rootMap.getBounds().topL as L.LatLng,
                this.rootMap.getBounds().botR as L.LatLng);
            isPointInMapArea = !lBouds.contains(e.latlng);
        } else {
            const parentSpot: Spot = this.mapToEdit.getParentSpot()!;
            const shape: Shape = parentSpot.getShape()!;
            const coods: number[][][] = shape.coordinates as number[][][];
            const latlngs: L.LatLng[] = coods[0].map((c: number[]) => new L.LatLng(c[1], c[0]));
            isPointInMapArea = !isPointInPolygon(e.latlng, latlngs);
        }
        if (isPointInMapArea) {
            this.outOfMapRangeWarningIsVisible = true;
            setTimeout(() => {
                this.outOfMapRangeWarningIsVisible = false;
            }, 3000);
            return;
        }
        const newId = ++this.currentId;
        const newSpot: Spot = new Spot(
            newId, 'スポット ' + newId, e.latlng, undefined, undefined, undefined, undefined, this.spotTypeToAddNext,
        );
        this.mapToEdit.addSpot(newSpot);


        const spotMarker: SpotMarker = this.displaySpotMarker(newSpot);
        this.switchFocusedMarker(spotMarker);
        this.drawer = true;
    }

    private displaySpotMarker(spot: Spot): SpotMarker {
        const newMarker: SpotMarker = new SpotMarker(spot);
        newMarker.addTo(this.lMap);
        newMarker.on('click', (event) => this.switchFocusedMarker(event.target));
        this.spotMarkers.push(newMarker);
        return newMarker;
    }

    private unfocusedMarker(): void {
        if (this.focusedSpot !== null) {
            const focusedMarker = this.spotMarkers
                .find(((marker) => marker.getSpot().getId() === (this.focusedSpot as Spot).getId()));
            focusedMarker?.setSelected(false);
        }
        this.focusedSpot = null;
    }

    /**
     * 地図上でフォーカスされるマーカーを切り替える
     * @param newMarker 新しくフォーカスされるマーカー
     */
    private switchFocusedMarker(newMarker: SpotMarker): void {
        this.unfocusedMarker();
        newMarker.setSelected(true);
        this.focusedSpot = newMarker.getSpot();
    }

    /**
     * フォーカスされているスポットをマップから消去する
     */
    private deleteFocusedSpot(): void {
        if (this.focusedSpot === null) {
            return;
        }
        const focusedSpot: Spot = this.focusedSpot;
        this.spotMarkers.find((marker) => marker.getSpot().getId() === focusedSpot.getId())?.remove();
        this.spotMarkers = this.spotMarkers
            .filter((marker) => marker.getSpot().getId() !== focusedSpot.getId());
        focusedSpot.getParentMap()?.removeSpot(focusedSpot.getId());
        this.displayPolygonsOfSpotsToEdit();
        this.shapeEditor.removeShapeEditLine();
        this.shapeEditButtonIsVisible = false;
        this.setDefaultMethodOnMapClick();
        this.focusedSpot = null;
    }

    /**
     * フォーカスされている地図上のスポットマーカーの名前表示を更新する
     */
    private updateFocusedMarkerName(): void {
        if (this.focusedSpot === null) {
            return;
        }
        this.spotMarkers
            .find((marker) => marker.getSpot().getId() === (this.focusedSpot as Spot).getId())?.addTo(this.lMap);
    }

    /**
     * マップクリック時に実行される関数を，形状描画メソッドにする
     */
    private setAddPointMethodOnMapClick(): void {
        this.whileShapeEditing = true;
        if (this.leafletContainer !== null) {
            this.leafletContainer.style.cursor = 'crosshair';
        }
        this.shapeEditButtonIsVisible = true;
        this.onMapClick = (e: {
            latlng: L.LatLng, afterSecondClick: () => void, afterAddEndPoint: (shape: Shape) => void,
        }) => {
            e.afterSecondClick = () => {
                this.messageWhileShapeEditing = '始点をクリックして範囲選択を終了する';
            };
            /**
             * ラインの終点が描画された後に呼び出される関数
             * ポリゴンの描画や後処理を行う
             * @param shape ポリゴンの元となる描画情報
             */
            e.afterAddEndPoint = (shape: Shape) => {
                if (this.leafletContainer !== null) {
                    this.leafletContainer.style.removeProperty('cursor');
                }
                this.shapeEditButtonIsVisible = false;
                this.focusedSpot?.setShape(shape);
                this.displayPolygonsOfSpotsToEdit();

                /**
                 * 始点のCircleMarkerがクリックされた場合に本コールバックメソッドは呼ばれるが,
                 * その直後に必ずmapのクリックイベントも発生するため，遅延を設けないと
                 * defaultMethodが勝手に呼ばれてしまう
                 * またこのメソッドが呼ばれる際のクリックをダブルクリックで行うと，
                 * 500ms以内にmapのクリックイベントが発生してしまいaddPointメソッドが呼ばれるので
                 * 500ms間の繋ぎとしてundefinedをセットしている
                 */
                this.onMapClick = (event: any) => undefined;
                setTimeout(this.setDefaultMethodOnMapClick, 500);
                this.whileShapeEditing = false;
                this.messageWhileShapeEditing = 'クリックしてスポットの範囲を描画';
            };
            this.shapeEditor.addPoint(e);
        };
    }

    /**
     * 編集ツールバーコンボーネントでモードが切り替わった際に実行される
     */
    private cancelShapeEditMode() {
        this.shapeEditButtonIsVisible = false;
        this.shapeEditor.removeShapeEditLine();
        this.whileShapeEditing = false;
    }

    /**
     * マップを拡大する
     * EditorToolBarコンポーネントがclickZoomInイベントを発生させた時に実行される
     */
    private zoomIn() {
        this.lMap.zoomIn();
    }

    /**
     * マップを縮小する
     * EditorToolBarコンポーネントがclickZoomOutイベントを発生させた時に実行される
     */
    private zoomOut() {
        this.lMap.zoomOut();
    }

    /**
     * マップをクリックしたときに実行される
     * EditorToolBarからEmitされるイベントによって中身が切り替わる
     * デフォルトでは何もしない(undefined)
     * @param e Leafletイベント(addSpotメソッドでe.latlngを取得するためにany型にしている)
     */
    private onMapClick: (e: any) => void = (e: any) => undefined;

    /**
     * アップロードボタンクリック時にセットする
     */
    private setMapToStore() {
        mapViewMutations.setRootMap(this.rootMap);
    }

    /**
     * SpotEditorの詳細マップ追加ボタンをクリックすると呼ばれ、スポットに詳細マップを追加する。
     * 現状はマップ生成時にnameを定数値にしている。
     * boundsは親スポットのshapeから算出する。
     */
    private addDetailMap() {
        const nextMapId: number = ++this.currentId;
        // 形状追加したスポットについてのみ詳細マップを追加できるため、getShapeはundefinedになりえない
        const shape: Shape = this.focusedSpot!.getShape()!;
        const coods: number[][][] = shape.coordinates as number[][][];
        const coordlatlng: Array<{latitude: number, longitude: number}> = coods[0].map((c: number[]) => {
            return {
                latitude: c[1],
                longitude: c[0],
            };
        });
        const spotBounds = getBounds(coordlatlng);
        const mapBounds: Bounds = {
            topL: { lat: spotBounds.minLat, lng: spotBounds.minLng },
            botR: { lat: spotBounds.maxLat, lng: spotBounds.maxLng },
        };

        const newDetailMap: Map = new Map(
            nextMapId,
            'testDetailMap' + String(nextMapId),
            mapBounds,
            undefined,
        );

        this.focusedSpot!.addDetailMaps([newDetailMap]);
        newDetailMap.setParentSpot(this.focusedSpot!);
    }

    /**
     * SpotEditorから詳細マップ複製イベントが発火されると呼び出され、
     * 引数のマップを編集する状態に移行する。
     * @param map 編集対象のマップ
     */
    private editDetailMap(map: Map): void {
        // 表示されていたマーカーを削除
        this.spotMarkers.forEach((sm: SpotMarker) => sm.remove());
        this.spotMarkers = [];
        // 編集するマップをセット
        this.mapToEdit = map;
        // 編集するマップにフォーカス
        this.flyToMapBounds();
        // マーカー、ポリゴンを表示を表示
        this.mapToEdit.getSpots().forEach((s: Spot) => this.addMarkerToMap(s));
        this.displayPolygonsOfSpotsToEdit();
        this.focusedSpot = null;
    }

    /**
     * 編集対象のマップに所属するスポットのポリゴンを表示する。
     * マップに親スポットがある場合は親スポットのポリゴンも表示。
     */
    private displayPolygonsOfSpotsToEdit(): void {
        // 親スポットが存在する場合は親スポットのポリゴンも表示対象に追加
        const spotsToDisplay: Spot[] = this.mapToEdit.getSpots().slice();
        this.shapeEditor.displayPolygons(spotsToDisplay);
        const parentSpot: Spot | undefined = this.mapToEdit.getParentSpot();
        if (parentSpot !== undefined) {
            this.shapeEditor.addPolygonLine(parentSpot);
        }
    }

    /**
     * treeviewでマップを選択すると選択したマップを編集対象にする
     * @param id 詳細マップのid
     */
    private setMapToEdit(id: number) {
        const mapToEdit: Map | null = this.rootMap.findMap(id);
        if (mapToEdit === null) {
            throw new Error('This selected map does not exist.');
        }
        this.editDetailMap(mapToEdit);
    }

    private setSpotToEdit(id: number) {
        const spotToEdit: Spot | null = this.rootMap.findSpot(id);
        if (spotToEdit === null) {
            throw new Error('This selected spot does not exist.');
        }
        const parentMap: Map | undefined = spotToEdit.getParentMap();
        if (parentMap === undefined) {
            throw new Error('The parent map of selected spot does not exist.');
        }
        this.editDetailMap(parentMap);
        this.focusedSpot = spotToEdit;
    }

    /**
     * スポットを画面上のマーカーとして登録する
     * @param spot: 画面にマーカーとして登録したいスポット
     */
    private addMarkerToMap(spot: Spot) {
        const newMarker: SpotMarker = new SpotMarker(spot);
        newMarker.addTo(this.lMap);
        newMarker.on('click', (event) => this.switchFocusedMarker(event.target));
        this.spotMarkers.push(newMarker);
    }

    /**
     * SpotEditorから詳細マップ複製イベントが発火されると呼び出され、
     * 引数のマップを複製してスポットに登録する。
     * @param map 複製対象のマップ
     */
    private duplicateDetailMap(map: Map) {
        const nextMapId = ++this.currentId;
        const dupDetailMap = cloneDeep(map);
        this.setNewMapId(dupDetailMap);
        this.focusedSpot!.addDetailMaps([dupDetailMap]);
    }

    /**
     * マップにnewIdをセットする。spotのIdも更新する。
     * @param map newIdを振りたいマップ
     */
    private setNewMapId(map: Map): void {
        map.setId(++this.currentId);
        map.setName(map.getName() + '_copy');
        map.getSpots().forEach((s: Spot) => this.setNewSpotId(s));
    }

    /**
     * スポットにnewIdをセットする。detialMapのIdも更新する。
     * @param spot newIdを振りたいスポット
     */
    private setNewSpotId(spot: Spot): void {
        spot.setId(++this.currentId);
        spot.setName(spot.getName() + '_copy');
        spot.getDetailMaps().forEach((m: Map) => this.setNewMapId);
    }

    /**
     * SpotEditorから詳細マップ削除イベントが発火されると呼び出され、
     * 指定されたidを持つ詳細マップをスポットから削除する
     * @param id 削除対象マップのid
     */
    private deleteDetailMap(id: number) {
        this.focusedSpot!.deleteDetailMap(id);
    }

    /**
     * 次に設置するマップ及びスポットのIDを得る
     */
    private getNextId(): number {
        const spotIds: number[] = this.rootMap.getAllDescendantSpots().map((spot) => spot.getId());
        const maxNumOfSpotId = spotIds.reduce((accum, id) => Math.max(accum, id), -1);
        const mapIds: number[] = this.rootMap.getAllDescendantMaps().map((map) => map.getId());
        const maxNumOfMapId = mapIds.reduce((accum, id) => Math.max(accum, id), -1);
        return Math.max(maxNumOfSpotId, maxNumOfMapId) + 1;
    }

    /**
     * RootMap以下の全てのMapとSpotのIDを連番で再設定する
     */
    private resetAllIds(): void {
        let id: number = 0;
        const maps: Map[] = this.rootMap.getAllDescendantMaps();
        for (const map of maps) {
            map.setId(id++);
        }
        const spots: Spot[] = this.rootMap.getAllDescendantSpots();
        for (const spot of spots) {
            spot.setId(id++);
        }
    }
}


