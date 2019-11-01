<template>
    <div class="map">
        map
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import leaflet from 'leaflet/dist/leaflet.css';
import L from leaflet;
import store from './store'
import { mapState } from 'vuex';

@Component
export default class Map extends Vue {
    map: any;
    latlng: any;
    object: any;

    class Marker extends Map{
        constructor(){
            super(map);
            super(latlng);
            }
        displyMarker(){
            //マーカーの表示
            L.marker(this.latlng).addTo(this.map);
        }
        returnMarkerInfo(latlng: number){
            let loc = geoLocation();
            //マーカーの情報を返す
            if(location){
                return this.$store.getters.getMarkerInfo;
            }else{
            //マーカーが無い場合の処理
            }
        }
    }

    function changeMarker(){
        //マーカーの切り替え
        let spot = $store.getters.getMarkerInfo;
        if(spot){
            map.removeLayer();
            L.marker(latlng).addTo(map);
        }else{
            //スポットの情報が無い時の処理
        }
    }

    class Object extends Map{
        constructor(){
            super(map);
            super(object);
        }
        displayObject(){
            //オブジェクトの表示
        }
        returnObjectInfo(){
            //オブジェクトの情報を返す
            return this.$store.getters.getObjectInfo;
        }
    }

    function changeObject(){
        //オブジェクトの切り替え
    }

    //マーカーに関するコールバック関数
    function markerCallback(){
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
