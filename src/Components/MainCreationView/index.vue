<template>
  <div id="main-creation-view">
    <v-app>
      <CreationMapView/>
      <v-container id="bottom-container" class="pa-0">
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="5"
            class="pa-0"
          >
          <EditorToolBar/>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import CreationMapView from '@/components/CreationMapView/index.vue';
import EditorToolBar from '@/components/EditorToolBar/index.vue';

@Component({
    components: {
        CreationMapView,
        EditorToolBar,
    },
})
export default class MainCreationView extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body,
#main-creation-view {
  position: relative;
  height: 100%;
}
#bottom-container {
  position: absolute;
  left: 0px;
  bottom: 0px;
  z-index: 1000;
  pointer-events: none;
}
body {
  margin: 0;
  height: 100%;
}
</style>
