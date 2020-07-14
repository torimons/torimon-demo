<template>
  <div class="map-selection">
    <v-app>
      <v-card
        flat
        tile
      >
        <v-app-bar app color="primary" dark>
          <v-toolbar-title>Selection Page</v-toolbar-title>
        </v-app-bar>
        <v-container id="search-bar" class="pt-12" fluid>
          <v-row>
            <v-col
              cols="12"
            >
              <MapSearch class="pt-2"/>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <router-link to="CreationMapView">
        <v-btn
          fab
          fixed
          bottom
          right
          color="secondary"
          dark
          id="create-map"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </router-link>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapSearch from '@/components/MapSearch/index.vue';

@Component({
  components: {
    MapSearch,
  },
})
export default class MapSelection extends Vue {
}
</script>

<style scoped>
#search-bar {
  pointer-events: none;
}
</style>
