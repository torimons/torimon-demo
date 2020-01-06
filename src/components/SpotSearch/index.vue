<template>
    <div id="spot-search">
        <SearchBox/>
        <SpotList :spotSearchResults="spotSearchResults"></SpotList>
        <!-- PropでSpotListにデータを渡す -->
    </div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* #spot-search{
    position:absolute;
    left: 10px;
    top: 10px;
    z-index: 1000;
} */
</style>
