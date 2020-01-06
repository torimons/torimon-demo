<template>
    <div id="spot-search">
        <v-card tile>
            <SearchBox class="pa-2"/>
            <SpotList :spotSearchResults="spotSearchResults"></SpotList>
        </v-card>
        <!-- PropでSpotListにデータを渡す -->
    </div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
