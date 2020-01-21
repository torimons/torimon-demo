<template>
    <div id="spot-search">
        <v-card
            tile
            flat
        >
            <SearchBox
                @searchWordInput="setSearchWord"
                @toggleSpotList="setSpotListIsVisible"
            />
            <SpotList
                :spotSearchResults="spotSearchResults"
                @hideSpotList="setSpotListIsVisible"
                v-show="spotListIsVisible"
                class="px-2 pb-2"
            ></SpotList>
        </v-card>
        <!-- PropでSpotListにデータを渡す -->
    </div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
