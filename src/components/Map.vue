<template>
    <div class="map">
        map
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import leaflet from 'leaflet/dist/leaflet.css';
import L from leaflet;
import store from './store';
import { mapState } from 'vuex';

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

    //マーカー表示
    private loadMarkers(e){
        /*
        マーカーの表示
        */
    }

    //ズームレベルが変更された際のマーカー表示
    private switchMarkers(e){
        /*
        現在表示されてるマーカーの削除
        マーカーの再表示
        */
    }
    
    //ズームレベルに応じたマーカーの表示
    private displayMarkers(){
        /*
        ズームレベルの取得
        ズームレベルに応じたマーカー群の取得
        取得したマーカー群の表示
        */
    }

    //オブジェクトの表示
    private loadObjects(e){ 
        /*
        オブジェクトの表示
        */
    }

    //ズームレベルが変更された際のオブジェクトの表示
    private switchObjects(e){
        /*
        現在表示されているオブジェクトの削除
        オブジェクトの再表示
        */
    }

    //ズームレベルに応じたオブジェクトの表示
    private displayObject(){
        /*
        ズームレベルの取得
        ズームレベルに応じたオブジェクトの情報を取得
        オブジェクトの形に応じてオブジェクトの表示
        */
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
