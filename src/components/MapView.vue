<template>
    <div id="map-view">
        <Map/>
        <!-- <SpotInfo/> -->
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Map from './Map.vue';
// import SpotInfo from './SpotInfo.vue';

@Component({
    components: {
        Map,
        // SpotInfo,
    },
})
export default class MapView extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body,
#map-view {
  height: 100%;
}
body {
  margin: 0;
}
</style>
