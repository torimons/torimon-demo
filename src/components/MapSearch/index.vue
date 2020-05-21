<template>
    <div id="map-search">
        <v-card
            tile
            flat
            :color="backgroundColor"
        >
            <SearchBox
                @searchWordInput="setSearchWord"
                @toggleMapList="setMapListIsVisible"
            />
            <MapList
                :mapSearchResults="mapSearchResults"
                @hideMapList="setMapListIsVisible"
                v-show="mapListIsVisible"
                class="px-2 pb-2"
            ></MapList>
        </v-card>
        <!-- PropでSpotListにデータを渡す -->
    </div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>