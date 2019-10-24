<template>
    <div id="app">
        <Map/>
        <SpotInfo/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Map from './components/Map.vue';
import SpotInfo from './components/SpotInfo.vue';

@Component({
    components: {
        Map,
        SpotInfo,
    },
})
export default class App extends Vue {}
</script>

<style>
</style>
