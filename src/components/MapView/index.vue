<template>
    <div id="map-view">
      <v-app>
        <Map/>
        <v-container id="map-container" class="pt-0" >
          <v-row>
            <v-col
              cols="12"
              sm="5"
              class="pl-0 pr-0 pt-0"
            >
              <SpotSearch/>
            </v-col>
          </v-row>
        </v-container>
        <div class="wrap">
          <div id="floor-switich-button">
            <FloorSwitchButton/>
          </div>
          <div id="spot-info">
            <SpotInfo/>
          </div>
        </div>
      </v-app>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Map from '@/components/Map/index.vue';
import SpotInfo from '@/components/SpotInfoCard/index.vue';
import FloorSwitchButton from '@/components/FloorSwitchButton/index.vue';
import SpotSearch from '@/components/SpotSearch/index.vue';

@Component({
    components: {
        Map,
        SpotInfo,
        FloorSwitchButton,
        SpotSearch,
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
  position: relative;
  height: 100%;
}

#map-container {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
}

.wrap {
  position: absolute;
  left: 0px;
  bottom: 0px;
  z-index: 1000;
}

#floor-switch-button {
  margin-left: 10px;
  margin-bottom: 10px;
}

#spot-info{
  margin-left: 5px;
  margin-bottom: 10px;
}

body {
  margin: 0;
}
</style>
