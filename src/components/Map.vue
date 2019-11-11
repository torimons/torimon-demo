<template>
    <div class="map">
        map
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import store from '../store';
import { mapState } from 'vuex';
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

    constructor(){
        super();
        /*
        osmタイルの初期化
        表示するマップのタイルの表示
        現在地の取得と現在地周りの表示
        初期化時のマーカー表示
        初期化時のオブジェクト表示
        */
       }

    //ズームレベルや階層が変更された際のマーカー表示切り替え
    private switchMarkers(e: Event): void{
        /*
        現在表示されてるマーカーの削除
        階層やズームレベルの取得
        マーカーの再表示
        */
       }

    //マーカーが押された際に呼び出される関数
    private updateFocusedMarker(e: Event): void{
        /*
        （vuexの状態更新も行う必要がある）
        押したマーカーのスポットの情報の取得
        ポップアップの表示
        */
       }

    //ズームレベルや階層が変更された際のオブジェクトの表示切り替え
    private switchPolygon(e: Event): void{
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
</style>
