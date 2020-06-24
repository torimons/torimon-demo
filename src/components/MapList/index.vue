<template>
	<div id="map-list">
        <v-list
            class="overflow-y-auto"
        >
            <MapItem
                v-for="mapSearchResult in mapSearchResults"
                v-bind:key="mapSearchResult.id + mapSearchResult.name"
                :mapName="mapSearchResult.mapName"
                :userName="mapSearchResult.userName"
            >
            </MapItem>
        </v-list>
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
