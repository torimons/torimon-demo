<template>
    <div id="creation-map-view">
      <v-app>
        <div id="map">
        </div>
        <v-container fluid id="toolbar-container">
          <v-row no-gutters>
            <v-col
              cols="5"
              md="3"
            >
              <SpotEditor
                @spotInput="updateFocusedMarkerName"
                :isVisible="spotEditorIsVisible"
                @close="spotEditorIsVisible = false"
                :spot="focusedSpot"
                @delete="deleteFocusedSpot"
                @add="addDetailMap"
                @dup="duplicateDetailMap"
                @del="deleteDetailMap"
              />
            </v-col>
            <v-col>
              <v-row justify="end" no-gutters>
                <EditorToolBar
                  @clickMove="setEmptyMethodOnMapClick"
                  @clickZoomIn="zoomIn"
                  @clickZoomOut="zoomOut"
                  @clickSelect="setEmptyMethodOnMapClick"
                  @clickSpot="setAddSpotMethodOnMapClick"
                />
              </v-row>
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
#toolbar-container {
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
