<template>
    <div id="map-search">
        <v-card
            tile
            flat
            :color="backgroundColor"
        >
            <div v-show="loading">
                <v-alert type="info">
                    データを取得しています
                    <template v-slot:append>
                        <v-progress-circular
                            indeterminate
                            color="white"
                        >
                        </v-progress-circular>
                    </template>
                </v-alert>
            </div>
            <v-alert
                v-if="!loading && !getDataSucceeded"
                type="error"
            >
                エラーが発生しました．リロードしてください．
            </v-alert>
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
        </v-card>
    </div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
