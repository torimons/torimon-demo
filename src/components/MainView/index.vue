<template>
    <div id="map-view">
      <v-app>
        <MapView/>
        <v-container id="map-container" class="pt-0" >
          <v-row>
            <v-col
              cols="12"
              sm="4"
              md="3"
              class="pa-0"
            >
              <SpotSearch/>
            </v-col>
          </v-row>
        </v-container>
        <v-container id="bottom-container" class="pa-0">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="5"
              class="pa-0"
            >
              <FloorSwitchButton class="pa-2"/>
              <SpotInfo class="px-2 pb-2" />
            </v-col>
          </v-row>
        </v-container>
      </v-app>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapView from '@/components/MapView/index.vue';
import SpotInfo from '@/components/SpotInfoCard/index.vue';
import FloorSwitchButton from '@/components/FloorSwitchButton/index.vue';
import SpotSearch from '@/components/SpotSearch/index.vue';

@Component({
    components: {
        MapView,
        SpotInfo,
        FloorSwitchButton,
        SpotSearch,
    },
})
export default class MainView extends Vue {
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
  pointer-events: none;
}

#bottom-container {
  position: absolute;
  left: 0px;
  bottom: 0px;
  z-index: 1000;
  pointer-events: none;
}

body {
  margin: 0;
}
</style>
