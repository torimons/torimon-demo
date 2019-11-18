<template>
    <div id="map">map</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapViewStore } from '@/store/modules/MapViewModule';
import { mapState } from 'vuex';
import { SpotForMap } from '@/store/types'
import store from '../store';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

/*
leafletの導入
必要であればプラグインの導入
*/

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
    private centerLat: number = 35;
    private centerLng: number = 139;
    private zoomLevel: number = 15;
    private tileLayer!: L.TileLayer;

    public mounted() {
        /*
        osmタイルの初期化
        表示するマップのタイルの表示
        現在地の取得と現在地周りの表示
        初期化時のマーカー表示
        初期化時のオブジェクト表示
        */
        const rootMapTopL = mapViewStore.rootMapBounds.topL;
        const rootMapBotR = mapViewStore.rootMapBounds.botR;
        const p1 = L.point(rootMapTopL.lat, rootMapTopL.lng);
        const p2 = L.point(rootMapBotR.lat, rootMapBotR.lng);
        const bounds = L.bounds(p1, p2);
        const centerPoint = bounds.getCenter();
        this.centerLat = centerPoint.x;
        this.centerLng = centerPoint.y;
        console.log("lat"+this.centerLat);
        console.log("lng"+this.centerLng);
        this.map = L.map('map').setView([this.centerLat, this.centerLng], this.zoomLevel);
        this.tileLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        ).addTo(this.map);
        const sampleIcon = L.icon({
            iconUrl: 'https://ke1q84.info/wp-content/uploads/2019/08/299BC8E1-F4BE-426C-A2D4-CC36C9D73AB5-500x400.jpeg',
            iconRetinaUrl: 'https://ke1q84.info/wp-content/uploads/2019/08/299BC8E1-F4BE-426C-A2D4-CC36C9D73AB5-500x400.jpeg',
            iconSize: [150, 120],
            iconAnchor: [25, 50],
            popupAnchor: [0, -50],
        });
        const spots: SpotForMap[] = mapViewStore.getSpotsForMap(mapViewStore.rootMapId);
        spots.forEach(spot => {
            L.marker([spot.coordinate.lat, spot.coordinate.lng], { icon: sampleIcon }).bindPopup(spot.name).addTo(this.map);
        });
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
    private switchPolygon(e: Event): void {
        /*
        現在表示されているオブジェクトの削除
        階層やズームレベルの取得
        オブジェクトの再表示
        */
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
