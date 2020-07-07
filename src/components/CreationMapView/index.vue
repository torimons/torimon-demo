<template>
    <div id="creation-map-view">
      <v-app>
        <div id="map">
        </div>
        <v-container
          fluid
          id="map-information-dialog-container"
        >
          <v-row>
            <v-col>
              <v-row justify="center">
                <v-alert
                  type="info"
                  border="top"
                  colored-border
                  color="#CF944E"
                  v-show="mapAreaSelectionInfoIsVisible"
                >
                  作成するマップの範囲を選択してください
                </v-alert>
                <v-alert
                  type="warning"
                  border="top"
                  colored-border
                  color="#824F3E"
                  v-show="outOfMapRangeWarningIsVisible"
                >
                  作成するマップの範囲外です
                </v-alert>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <v-container fluid id="toolbar-container">
          <v-row>
            <v-col>
              <v-app-bar
                id="top-bar"
                app
                dense
                color="#3F8373"
                dark
              >
                <v-btn
                  @click="dialog = true"
                  color="#76978F"
                >
                  <v-icon>cloud_upload</v-icon>
                </v-btn>
                <v-toolbar-title
                  class="pl-5"
                  @mouseover="focusMapNameInputForm"
                >
                  <v-text-field
                    ref="mapNameForm"
                    :value="map.getName()"
                    @input="(value) => {map.setName(value)}"
                    v-show="whileMapNameEditing"
                    @blur="whileMapNameEditing=false;mapNameColor='background-color:#3F8373';"
                  ></v-text-field>
                      <span
                        :style="mapNameColor"
                        class="pa-2"
                        @mouseenter="mapNameColor='background-color:#76978F'"
                        @mouseleave="mapNameColor='background-color:#3F8373'"
                        @click="whileMapNameEditing=true"
                        v-show="!whileMapNameEditing"
                      >
                        {{ map.getName() }}
                      </span>
                </v-toolbar-title>
              </v-app-bar>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="5"
              md="3"
            >
              <SpotEditor
                class="pt-6"
                @spotInput="updateFocusedMarkerName"
                :isVisible="focusedSpot !== null"
                :disabledShapeEditButton="disabledShapeEditButtonInSpotEditor"
                @close="unfocusedMarker"
                :spot="focusedSpot"
                @clickAddShapeButton="setAddPointMethodOnMapClick"
                @delete="deleteFocusedSpot"
                @add="addDetailMap"
                @dup="duplicateDetailMap"
                @del="deleteDetailMap"
              />
            </v-col>
            <v-col>
              <v-row justify="end" no-gutters>
                <EditorToolBar
                  class="pt-7"
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
          <v-dialog
            v-model="dialog"
            width="1000"
          >
            <MapInformationDialog
              @closeDialog="dialog = false"
            />
          </v-dialog>
        </v-container>
          <v-btn 
            color="#E18632"
            fab
            small
            dark
            id="reset-location"
            v-show="flyToMapBoundsButtonIsVisible"
            @click="flyToMapBounds"
          >
            <v-icon>my_location</v-icon>
          </v-btn>

      </v-app>
    </div>
</template>

<script lang='ts' src='./index.ts'/>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body,
#top-bar {
  pointer-events: auto;
}
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
  z-index: 1000;
  pointer-events: none;
}
#map-information-dialog-container {
  position: absolute;
  z-index: 1100;
  pointer-events: none;
}
#reset-location {
  position: absolute;
  z-index: 1100;
  pointer-events: auto;
  bottom: 3%;
  right: 2%;
}

body {
  margin: 0;
  height: 100%;
}
</style>
