<template>
    <div id="map-view">
      <v-app>
        <Map/>
        <FloorSwitchButton/>
        <!-- <SearchBox/> -->
        <!-- <SpotItem spotName="hoge" distance="1000 m"/> -->
        <!-- <SpotInfo/> -->
      </v-app>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Map from '@/components/Map/index.vue';
// import SpotInfo from './SpotInfo.vue';
import FloorSwitchButton from '@/components/FloorSwitchButton/index.vue';
// import SearchBox from '@/components/SearchBox/index.vue';
// import SpotItem from '@/components/SpotItem/index.vue';

@Component({
    components: {
        Map,
        // SpotInfo,
        FloorSwitchButton,
        // SearchBox,
        // SpotItem,
    },
})
export default class MapView extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body,
#map-view {
  height: 100%;
}
body {
  margin: 0;
}
</style>
