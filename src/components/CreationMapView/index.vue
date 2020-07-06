<template>
    <div id="creation-map-view">
      <v-app>
        <v-container fluid id="menu-container">
          <v-row no-gutters>
            <div id="map">
            </div>
          </v-row>
        <v-container>
        <v-container fluid id="menu-container">
          <v-row no-gutters>
            <v-col>
              <v-navigation-drawer
                v-model="drawer"
                app
                right
              >
                <v-list dense>
                        <v-list-item link>
                            <v-list-item-content>
                                <v-list-item-title>新規登録</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                </v-list>
              </v-navigation-drawer>
            </v-col>
          </v-row>
        </v-container>
        <v-container fluid id="map-information-dialog-container">
          <v-row>
            <v-col
              cols="1"
            >
              <v-btn
                @click="dialog = true"
              >
                保存(仮)
              </v-btn>
              <v-dialog
                v-model="dialog"
                width="1000"
              >
                <MapInformationDialog
                  @closeDialog="dialog = false"
                />
              </v-dialog>
            </v-col>
            <v-col>
              <v-row justify="center">
                <v-alert
                  type="info"
                  border="top"
                  colored-border
                  color="#824F3E"
                  v-show="mapAreaSelectionInfoIsVisible"
                >
                  作成する地図の範囲を選択してください
                </v-alert>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <v-container fluid id="toolbar-container">
          <v-row no-gutters>
            <v-col
              cols="5"
              md="3"
            >
              <SpotEditor
                @spotInput="updateFocusedMarkerName"
                :isVisible="focusedSpot !== null"
                :disabledShapeEditButton="disabledShapeEditButtonInSpotEditor"
                @close="unfocusedMarker"
                :spot="focusedSpot"
                @clickAddShapeButton="setAddPointMethodOnMapClick"
                @delete="deleteFocusedSpot"
              />
            </v-col>
            <v-col>
              <v-row justify="end" no-gutters>
                <EditorToolBar
                  @clickMove="setDefaultMethodOnMapClick"
                  @clickZoomIn="zoomIn"
                  @clickZoomOut="zoomOut"
                  @clickSelect="setDefaultMethodOnMapClick"
                  @clickSpot="setAddSpotMethodOnMapClick"
                  @switchMode="onSwitchModeOfToolBar"
                  :spotButtonIsVisible="spotButtonInEditorToolBarIsVisible"
                  :shapeEditButtonIsVisible="shapeEditButtonIsVisible"
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
  cursor: pointer
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
#map-information-dialog-container {
  position: absolute;
  z-index: 1000;
}

#menu-container {
  position: absolute;
  z-index: 1100;
}

body {
  margin: 0;
  height: 100%;
}
</style>
