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
            <MapDetailCard
                :dialog="dialog"
            ></MapDetailCard>
        </v-card>
    </div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
