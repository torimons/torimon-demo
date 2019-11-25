<template>
  <div id="map">map</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';
import store from '@/store';
import { mapViewStore } from '@/store/modules/MapViewModule';
import { SpotForMap, Coordinate } from '@/store/types';
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
  private centerLat: number = 33.59;
  private centerLng: number = 130.21;
  private zoomLevel: number = 15;
  private tileLayer!: L.TileLayer;
  private testIcon = L.icon({
    iconUrl: 'http://localhost:8080/favicon.ico',
    iconSize: [30, 30],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
  }); 
  private markers: L.Marker[] = []; 

  public mounted() {
    /*
        osmタイルの初期化
        表示するマップのタイルの表示
        現在地の取得と現在地周りの表示
        初期化時のマーカー表示
        初期化時のオブジェクト表示
        */
    this.map = L.map('map').setView(
      [this.centerLat, this.centerLng],
      this.zoomLevel,
    );
    this.tileLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ).addTo(this.map);

    this.markers = [L.marker([this.centerLat, this.centerLng], { icon: this.testIcon })];
    this.markers.map((marker: L.Marker) => marker.addTo(this.map));
    this.map.on('zoomstart', this.switchMarkers);
  }

  /** 現在のマーカー削除し，spotsの座標にマーカーを配置する 
   * @param spots 表示したいスポットの配列
  */
  private replaceMarkers(spots: SpotForMap[]): void {
    const coordinates: Coordinate[] = spots.map(
      (spot: SpotForMap) => spot.coordinate,
    );
    // removeしてから取り除かないと描画から消えない
    this.markers.forEach((marker: L.Marker) => marker.remove());
    this.markers = coordinates.map((coord: Coordinate) => L.marker(coord, {icon: this.testIcon}));
    this.markers.map((marker: L.Marker) => marker.addTo(this.map));
  }

  /** ズームレベルや階層が変更された際のマーカー表示切り替え
   * @param e 発火イベント
   */
  private switchMarkers(e: L.LeafletEvent): void {
    // 表示するスポット一覧を取得
    const focusedMapId: number = mapViewStore.focusedMapId;
    const spots: SpotForMap[] = mapViewStore.getSpotsForMap(focusedMapId);
    this.replaceMarkers(spots);
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
