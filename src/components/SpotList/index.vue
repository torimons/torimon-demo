<template>
	<div id="spot-list">
        <v-list
            class="overflow-y-auto"
        >
            <SpotItem
                v-for="spotSearchResult in spotSearchResults"
                v-bind:key="spotSearchResult.id + spotSearchResult.name"
                :spotId="spotSearchResult.id"
                :spotName="spotSearchResult.name"
                :distance="'1000km'"
                :position="spotSearchResult.coordinate"
            >
            </SpotItem>
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
}
</style>
