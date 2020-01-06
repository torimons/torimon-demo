<template>
	<div id="spot-list">
        <SpotItem 
            v-for="spotSearchResult in spotSearchResults"
            v-bind:key="spotSearchResult.id"
            :spotId="spotSearchResult.id"
            :spotName="spotSearchResult.name">
        </SpotItem>
	</div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#spot-list{
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 1000;
}
</style>
