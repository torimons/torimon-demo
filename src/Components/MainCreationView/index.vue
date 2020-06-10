<template>
  <div id="main-creation-view">
    <v-app>
      <CreationMapView/>
      <v-container fluid id="bottom-container">
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="3"
          >
            <SpotEditor/>
          </v-col>
          <v-col
            cols="12"
            sm="1"
            class="pa-0 ml-auto"
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
import SpotEditor from '@/components/SpotEditor/index.vue';

@Component({
    components: {
        CreationMapView,
        EditorToolBar,
        SpotEditor,
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
  right: 0px;
  top: 0px;
  z-index: 1000;
  pointer-events: none;
}
body {
  margin: 0;
  height: 100%;
}
</style>
