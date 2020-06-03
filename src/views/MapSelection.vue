<template>
    <div class="map-selection">
        <v-app>
            <v-card>
                <v-card-title>
                    <h1 class="title">Map Selection Page</h1>
                </v-card-title>
            </v-card>
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
  left: 0px;
  top: 65px;
  z-index: 1000;
  pointer-events: none;
}
</style>
