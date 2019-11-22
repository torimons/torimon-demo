<template>
    <div id='map'>
        map
    </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import store from '../store';
import { mapState } from 'vuex';
import { SpotForMap, Shape } from '../store/types';
import { mapViewStore } from '@/store/modules/MapViewModule';
/*
leafletの導入
必要であればプラグインの導入
*/
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoJsonObject, GeometryObject, GeometryCollection, Feature, FeatureCollection } from 'geojson';

@Component
export default class Map extends Vue {
    /*
    必要な情報
    --マップ自身
    --取得したマップの情報
        --表示するマップ
        --マーカーのリスト
            --マーカーの座標
        --オブジェクトのリスト
            --オブジェクトの座標
            --オブジェクトの形状
    --omsのタイルレイヤー
    */
    private map!: L.Map;
    private spotForMap!: SpotForMap[];

    constructor() {
        super();
        /*
        osmタイルの初期化
        表示するマップのタイルの表示
        現在地の取得と現在地周りの表示
        初期化時のマーカー表示
        初期化時のオブジェクト表示
        */
    }

    /**
     * とりあえず地図の表示を行なっています．
     */
    public mounted() {
        this.map = L.map( 'map', { center: L.latLng( 33.595507, 130.218285 ), zoom: 19 } ).addLayer(
            L.tileLayer( 'http://{s}.tile.osm.org/{z}/{x}/{y}.png' ),
            // L.tileLayer( 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png' ),
        );
        this.map.on('zoom', this.switchPolygon);

        // sampleMapのスポットのshapeを表示
        // storeからspotの情報を取得する
        // 現状はmapIdのgetterがないので直接指定しています．
        const mapId = 0;
        const spotForMap = mapViewStore.getSpotsForMap(mapId);

        const shapeGeojson = this.shapeToGeojson(spotForMap);
        const polygonLayer = new L.GeoJSON(shapeGeojson);
        this.$nextTick().then(() => {
            this.map.addLayer(polygonLayer);
        });
        
        // removeLayerを呼び出すと非表示にできます
        // this.map.removeLayer(geoJson);

    }

    /**
     * getSpotsForMapで取得したspotの情報から，shapeの情報だけを取り出し，
     * leafletのgeoJsonで扱えるように変換する
     * @params storeのgetSpotsForMapの返り値（spotForMap[]）.
     * @return geoJson formatのデータ
     */
    private shapeToGeojson(spots: SpotForMap[]): GeoJsonObject {
        let shapes: Feature[] = [];
        for (const spot of spots) {
            const shape = spot.shape! as GeometryObject;
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

    // ズームレベルや階層が変更された際のマーカー表示切り替え
    private switchMarkers(e: Event): void {
        /*
        現在表示されてるマーカーの削除
        階層やズームレベルの取得
        マーカーの再表示
        */
       }

    // マーカーが押された際に呼び出される関数
    private updateFocusedMarker(e: Event): void {
        /*
        （vuexの状態更新も行う必要がある）
        押したマーカーのスポットの情報の取得
        ポップアップの表示
        */
       }

    // ズームレベルや階層が変更された際のオブジェクトの表示切り替え
    // Event型だとイベントリスナーとして登録できなかったため，一旦anyにしています．
    private switchPolygon(e: any): void {
        /*
        現在表示されているオブジェクトの削除
        階層やズームレベルの取得
        オブジェクトの再表示
        */
        const zoomLevel: number = this.map.getZoom();

    }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
html,
body,
#map {
  height: 100%;
}
body {
  margin: 0;
}
</style>
