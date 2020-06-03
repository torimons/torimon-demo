<template>
    <div class="map-selection">
        <v-app>
            <v-container id="search-bar" class="pt-0" >
            <v-row>
                <v-col
                cols="12"
                sm="4"
                md="3"
                class="pa-0"
                >
                <MapSearch/>
                </v-col>
            </v-row>
            </v-container>
        </v-app>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapSearch from '@/components/MapSearch/index.vue';

@Component({
    components: {
        MapSearch,
    },
})
export default class MapSelection extends Vue {
}
</script>

<style scoped>
#search-bar {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
  pointer-events: none;
}
</style>
