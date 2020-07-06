<template>
    <div id="creation-map-view">
      <v-app>
        <div id="map">
        </div>
        <v-container fluid id="app-bar" class="ma-0 pa-0">
          <v-row no-gutters>
            <v-col>
              <v-card>
                <v-app-bar
                  flat
                  tile
                  app
                >
                  <v-app-bar-nav-icon @click="drawer=!drawer"></v-app-bar-nav-icon>
                  <v-toolbar-title>{{ map.getName() }}</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="dialog = true"
                    icon
                  >
                    <v-icon>save</v-icon>
                  </v-btn>
                </v-app-bar>
                <v-navigation-drawer
                  app
                  v-model="drawer"
                >
                </v-navigation-drawer>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-container fluid id="map-information-dialog-container">
          <v-dialog
            v-model="dialog"
            width="1000"
          >
            <MapInformationDialog
              @closeDialog="dialog = false"
            />
          </v-dialog>
        </v-container>
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

#app-bar {
  position: absolute;
  z-index: 1100;
  left: 0px;
  top: 0px;
}

#toolbar-container {
  position: absolute;
  z-index: 1000;
  pointer-events: none;
  top: 64px;
}

#map-information-dialog-container {
  position: absolute;
  z-index: 1000;
}

body {
  margin: 0;
  height: 100%;
}
</style>
