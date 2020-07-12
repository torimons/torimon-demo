<template>
  <v-card
    class="d-flex flex-column"
  >
    <v-card-title>{{ name }}</v-card-title>
    <v-card-text>{{ description }}</v-card-text>
    <v-divider></v-divider>
    <v-container id="map-view-container">
      <MapView style="height: 40vh"/>
    </v-container>
    <v-card-actions>
      <v-btn
        text
        fab
        @click="close"
      >
        <v-icon>close</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <router-link :to="{ name: 'CreationMapView', params: { from: 'edit' }}" >
        <v-btn
          class="openMap mr-3"
          color="#3F8373"
          outlined
          rounded
          @click="openMap"
        >
          edit
          <v-icon>edit</v-icon>
        </v-btn>
      </router-link>
      <router-link to="/MainView">
        <v-btn
          class="openMap"
          color="#3F8373"
          dark
          @click="openMap"
        >
          Open
        </v-btn>
      </router-link>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map-view-container {
  position: relative;
  height: 100%;
}
a {
  text-decoration: none;
}
</style>
