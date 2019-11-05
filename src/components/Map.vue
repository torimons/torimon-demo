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
    mapInfo: any;
    tileLayer: any;

    constructor(){
        super();
        this.mapInfo = $store.getters.Mapinfo;
        this.map = L.map('map').setView([centerLat,centerLng], zoomLevel);
        this.tileLayer = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ).addTo(this.map)
    }
    
    //マーカーの初期化、ズームレベルの変更時
    map.on('load', loadMarkers);
    map.on('zoomlevelschange', switchMarkers);

    //オブジェクトの初期化、ズームレベルの変更時
    map.on('load', loadObjects);
    map.on('zoomlevelschange', switchObjet);

    //マーカーに関するコールバック関数
    //初期化時のマーカー表示
    private loadMarkers(e){
        displayMarkers();
    }
    private switchMarkers(e){
        this.map.removeLayer(e.target);
        displayMarkers();
    }
    
    //ズームレベルに応じたマーカーの表示
    private displayMarkers(){
        let zoomLevel: number = this.map.getZoom();
        let markerList: Array<number> = this.mapInfo.zoomlevel.markers; 
        L.marker(markerList).addTo(this.map);
    }

    //オブジェクト関するコールバック関数
    //初期化時のオブジェクト表示
    private loadObjects(e){ 
        displayObject();
    }
    private switchObjects(e){
        this.map.removeLayer(e.target);
        displayObject();
    }

    //ズームレベルに応じたオブジェクトの表示
    private displayObject(){
        //ズームレベルに応じたオブジェクトの情報を取得
        let zoomLevel: number = this.map.getZoom();
        let objectList: Array<number> = this.mapInfo.zoomLevel.objects;
        //多角形や円の表示
        for (i in objectList){
            if (objectType[i] == 'polygon'){
                let polygon = L.polygon(
                    [[lat1,lng1],
                    [lat2,lng2],
                    [lat3,lng3],
                    [lat4,lng4]
                    ],{
                        "color": "000000",
                        "weight": 3,
                        "fillcolor": "000000",
                        "fillopacity": 0.5 
                    }).addTo(this.map);
            }else if (objectType[i] == 'circle'){
                let circle = L.circle(
                    [centerLat,centerLng],
                    {
                        "radius": 500,
                        "color": "000000",
                        "fillcolor": "000000",
                        "fillopacity": 0.5
                    }).addTo(this.map);
            }else if{...}
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
