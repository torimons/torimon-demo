<template>
  <div id="map-list">
    <v-container fluid>
      <v-row>
        <v-col
          v-for="mapSearchResult in mapSearchResults"
          :key="mapSearchResult.getId()"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <MapItem
            :map="mapSearchResult"
          ></MapItem>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-list {
    /* SearchBoxのサイズと, ボトムの余白サイズを引いたものがSearchListのサイズになる */
    max-height: calc(100vh - (8vh + 16px) - 8px);
    pointer-events: auto;
}
</style>
