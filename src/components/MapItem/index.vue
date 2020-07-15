<template>
  <div id="map-item">
    <v-card
        tile
        @click.stop="openDialog()"
    >
      <v-img
        :src="require('@/assets/spot-marker.png')"
        height="200px"
      ></v-img>
      <v-card-title>
        {{ name }}
      </v-card-title>
      <v-card-subtitle>
        {{ description }}
      </v-card-subtitle>
    </v-card>
  </div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map-item {
    pointer-events: auto;
}
</style>
