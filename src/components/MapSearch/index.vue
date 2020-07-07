<template>
    <div id="map-search">
        <v-card
            tile
            flat
            :color="backgroundColor"
        >
            <div
                v-if="getDataSucceeded"
            >
                <SearchBox
                    @searchWordInput="setSearchWord"
                />
                <MapList
                    :mapSearchResults="mapSearchResults"
                    class="px-2 pb-2"
                ></MapList>
            </div>
            <v-alert
                v-else
                type="error"
            >
                エラーが発生しました．リロードしてください．
            </v-alert>
        </v-card>
    </div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
