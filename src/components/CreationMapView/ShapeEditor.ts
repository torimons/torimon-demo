import { GeoJsonObject, GeometryObject, Feature, FeatureCollection, Polygon } from 'geojson';
import { Coordinate, Shape, Bounds } from '@/store/types';
import L, { LeafletEvent, Marker } from 'leaflet';
import Spot from '@/Spot/Spot';

export default class ShapeEditor {
    private lMap!: L.Map;
    private routeLine: L.Polyline | null = null;
    private circleMarkers: L.CircleMarker[] = [];
    private polygonLayer?: L.GeoJSON<GeoJsonObject>; // 表示されるポリゴンのレイヤー
    private controlLayer: L.Control.Layers = L.control.layers({}, {});
    private coordinates: Coordinate[] = [];
    private rectangleStartPoint: L.LatLng | null = null;
    private rectangles: L.Rectangle[] = [];

    constructor(lMap: L.Map) {
        this.lMap = lMap;
        const pane = this.lMap.createPane('markerPane');
        pane.style.zIndex = '620';
    }

    public startRectangleSelection(e: { latlng: L.LatLng, onEndSelection: (bounds: L.LatLngBounds) => void }): void {
        if (this.rectangleStartPoint !== null) {
            return;
        }
        this.rectangleStartPoint = e.latlng as L.LatLng;
        this.lMap.on('mousemove', this.onDrawingRectangle);
        this.lMap.on('click', (event: any) => {
            event.onEndSelection = e.onEndSelection;
            this.endRectangleSelection(event);
        });
    }

    public onDrawingRectangle = (e: any): void => {
        if (this.rectangleStartPoint === null) {
            this.rectangleStartPoint = e.latlng as L.LatLng;
        }
        let topL: L.LatLng;
        let botR: L.LatLng;
        if (this.rectangleStartPoint.lat > e.latlng.lat && this.rectangleStartPoint.lng < e.latlng.lng) {
            topL = this.rectangleStartPoint;
            botR = e.latlng;
        } else if (this.rectangleStartPoint.lat > e.latlng.lat && this.rectangleStartPoint.lng > e.latlng.lng) {
            topL = new L.LatLng(this.rectangleStartPoint.lat, e.latlng.lng);
            botR = new L.LatLng(e.latlng.lat, this.rectangleStartPoint.lng);
        } else if (this.rectangleStartPoint.lat < e.latlng.lat && this.rectangleStartPoint.lng < e.latlng.lng) {
            topL = new L.LatLng(e.latlng.lat, this.rectangleStartPoint.lng);
            botR = new L.LatLng(this.rectangleStartPoint.lat, e.latlng.lng);
        } else {
            topL = new L.LatLng(e.latlng.lat, e.latlng.lng);
            botR = new L.LatLng(this.rectangleStartPoint.lat, this.rectangleStartPoint.lng);
        }
        this.drawRectangle({topL, botR});
    }

    public drawRectangle(bounds: Bounds): void {
        const topBounds = new L.LatLngBounds(
            {
                lat: bounds.topL.lat + 130,
                lng: bounds.topL.lng - 130,
            },
            {
                lat: bounds.topL.lat,
                lng: bounds.topL.lng + 130,
            },
        );
        const botBounds = new L.LatLngBounds(
            {
                lat: bounds.botR.lat,
                lng: bounds.botR.lng - 130,
            },
            {
                lat: bounds.botR.lat - 130,
                lng: bounds.botR.lng + 130,
            },
        );
        const rightBounds = new L.LatLngBounds(
            {
                lat: bounds.topL.lat,
                lng: bounds.topL.lng - 130,
            },
            {
                lat: bounds.botR.lat,
                lng: bounds.topL.lng,
            },
        );
        const leftBounds = new L.LatLngBounds(
            {
                lat: bounds.topL.lat,
                lng: bounds.botR.lng,
            },
            {
                lat: bounds.botR.lat,
                lng: bounds.botR.lng + 130,
            },
        );
        const boundsList: L.LatLngBounds[] = [];
        boundsList.push(topBounds, botBounds, rightBounds, leftBounds);

        this.rectangles.forEach((rec) => rec.remove());
        boundsList.forEach((b) => {
            this.rectangles.push(L.rectangle(b, {
                color: '#000000', fill: true, opacity: 0,
            }).addTo(this.lMap));
        });

    }

    public endRectangleSelection(e: { latlng: L.LatLng, onEndSelection: (bounds: L.LatLngBounds) => void }): void {
        if (this.rectangleStartPoint === null) {
            throw Error('There is no value at the start of the rectangle.');
        }
        this.lMap.off('mousemove');
        this.lMap.off('click');
        const bounds: L.LatLngBounds = new L.LatLngBounds(this.rectangleStartPoint, e.latlng);
        const zoomLevel = this.lMap.getBoundsZoom(bounds, false);
        this.lMap.setMaxBounds(new L.LatLngBounds(
            {
                lat: bounds.getNorthWest().lat + 1,
                lng: bounds.getNorthWest().lng - 1,
            },
            {
                lat: bounds.getSouthEast().lat - 1,
                lng: bounds.getSouthEast().lng + 1,
            },
        ));
        this.lMap.setMinZoom(zoomLevel - 1);
        e.onEndSelection(bounds);
    }

    /**
     * マップ上にCircleMarkerを用いた点と，前の点から続くPolyLineを用いた線を描画する
     * @param e 終点追加後に完成したShapeを引数に取るコールバック関数をメンバにもつ
     */
    public addPoint(e: { latlng: L.LatLng, afterAddEndPoint: (shape: Shape) => void }): void {
        this.coordinates.push(e.latlng as Coordinate);

        const circleMarker: L.CircleMarker = L.circleMarker(e.latlng, {
            pane: 'markerPane', radius: 6, weight: 1, color: 'black', fill: true, fillColor: 'white', fillOpacity: 1,
        });
        if (this.circleMarkers.length === 0) {
            circleMarker.on('click', (event) => {
                const shape: Shape = this.createShape();
                e.afterAddEndPoint(shape);
            });
        }
        circleMarker.addTo(this.lMap);
        this.circleMarkers.push(circleMarker);

        if (this.coordinates.length > 1) {
            if (this.routeLine !== null) {
                this.routeLine.remove();
                this.controlLayer.removeLayer(this.routeLine);
            }
            this.routeLine = L.polyline(this.coordinates, {
                color: '#555555',
                weight: 5,
                opacity: 0.7,
            });
            this.routeLine.addTo(this.lMap);
        }
    }

    /**
     * 指定されたスポットのポリゴンを表示する
     * polygonLayerメンバを変更して表示内容を変える．
     * @param spotsForDisplay 表示するスポットの配列
     */
    public displayPolygons(spotsForDisplay: Spot[]): void {
        // すでに表示されているポリゴンがある場合は先に削除する
        if (this.polygonLayer !== undefined) {
            this.lMap.removeLayer(this.polygonLayer);
        }
        const shapeGeoJson: GeoJsonObject = this.spotShapeToGeoJson(spotsForDisplay);
        this.polygonLayer = new L.GeoJSON(shapeGeoJson, {
            style: {
                color: '#555555',
                weight: 2,
                opacity: 0.1,
                fillColor: '#555555',
                fillOpacity: 0.3,
            },
        });
        this.lMap.addLayer(this.polygonLayer);
    }

    public removeShapeEditLine() {
        if (this.routeLine !== null) {
            this.routeLine.remove();
            this.routeLine = null;
        }
        this.circleMarkers.forEach((marker) => marker.remove());
        this.circleMarkers = [];
        this.coordinates = [];
    }

    /**
     * ユーザーに描画された点情報を基にShapeを構成する
     * @return 完成したShape情報
     */
    private createShape(): Shape {
        this.coordinates.push(this.coordinates[0]);
        const coords: number[][][] = [this.coordinates.map((coordinate) => {
            return [coordinate.lng, coordinate.lat];
        })];
        const shape: Shape = {
            type: 'Polygon',
            coordinates: coords,
        };
        this.removeShapeEditLine();
        return shape;
    }

    /**
     * spotの情報からshapeの情報を取り出してleafletで扱える形式に変換する．
     * @param spots GeoJson形式に変換したいspotの配列 .
     * @return GeoJson形式のshapeデータ
     */
    private spotShapeToGeoJson(spots: Spot[]): GeoJsonObject {
        const shapes: Feature[] = [];
        for (const spot of spots) {
            const shape = spot.getShape() as GeometryObject;
            const feature: Feature = {
                properties: {},
                type: 'Feature',
                geometry: shape,
            };
            shapes.push(feature);
        }
        const features: FeatureCollection = {
            type: 'FeatureCollection',
            features: shapes,
        };
        return features as GeoJsonObject;
    }
}
