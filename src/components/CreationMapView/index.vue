<template>
    <div id="creation-map-view">
      <v-app>
        <div id="map">
        </div>
        <v-container fluid id="bottom-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="1"
              class="pa-0 ml-auto"
            >
              <EditorToolBar
                @zoomIn="zoomIn"
                @zoomOut="zoomOut"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-app>
    </div>
</template>

<script lang='ts' src='./index.ts'/>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body,
#creation-map-view {
  height: 100%;
}
#map {
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
