<template>
	<div id="spot-list">
        <SpotItem
            v-for="spotSearchResult in spotSearchResults"
            v-bind:key="spotSearchResult.id + spotSearchResult.name"
            :spotId="spotSearchResult.id"
            :spotName="spotSearchResult.name"
            :distance="'1000km'">
        </SpotItem>
	</div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
