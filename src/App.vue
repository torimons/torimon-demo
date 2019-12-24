<template>
    <div id="app">
        <MapView/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MapView from '@/components/MapView/index.vue';

@Component({
    components: {
        MapView,
    },
})
export default class App extends Vue {}
</script>

<style>
html,
body,
#app {
  height: 100%;
}
body {
  margin: 0;
}
</style>
