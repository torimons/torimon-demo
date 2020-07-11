<template>
    <div id="creation-map-view">
      <v-app>
        <div id="map">
        </div>
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
                  type="info"
                  border="top"
                  colored-border
                  color="#CF944E"
                  v-show="whileShapeEditing"
                >
                  {{ messageWhileShapeEditing }}
                </v-alert>
                <v-alert
                  type="warning"
                  border="top"
                  colored-border
                  color="#824F3E"
                  v-show="outOfMapRangeWarningIsVisible"
                >
                  マップの範囲外です
                </v-alert>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <v-container fluid id="toolbar-container">
          <v-row>
            <v-col>
              <v-navigation-drawer
                v-model="drawer"
                app
                pointer-events="none"
                width="350px"
              >
                <v-card
                  flat
                >
                  <v-card
                    flat
                    color="#cbcdd1"
                  >
                  <v-card-text
                  >
                    Tree View
                  </v-card-text>
                  </v-card>
                  <v-treeview
                    hoverable
                    open-all
                    v-model="tree"
                    :items="items"
                    item-key="name"
                    dense
                  >
                  <template
                    v-slot:prepend="{ item }"
                  >
                    <div
                      @click="item.type === 'Map'
                        ? setMapToEdit(item.id) 
                        : setSpotToEdit(item.id)"
                    >
                    <v-btn
                      icon
                      v-if="item.type==='Map'"
                    >
                      <v-icon>
                        map
                      </v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      v-if="item.type==='Spot'"
                    >
                      <v-icon left
                      >
                        place
                      </v-icon>
                    </v-btn>
                    </div>
                  </template>
                  </v-treeview>
                </v-card>

                <v-card 
                  flat
                  v-if="focusedSpot !== null"
                >
                  <v-card
                    flat
                    color="#cbcdd1"
                  >
                  <v-card-text
                  >
                    Spot Editor
                  </v-card-text>
                  </v-card>
                  <SpotEditor
                    :isVisible="focusedSpot !== null"
                    @spotInput="updateFocusedMarkerName"
                    :whileShapeEditing="whileShapeEditing"
                    :spot="focusedSpot"
                    @clickAddShapeButton="setAddPointMethodOnMapClick"
                    @clickAddShapeCancelButton="cancelShapeEditMode"
                    @delete="deleteFocusedSpot"
                    @add="addDetailMap"
                    @edit="editDetailMap"
                    @dup="duplicateDetailMap"
                    @del="deleteDetailMap"
                  />
                </v-card>
              </v-navigation-drawer>
              <v-app-bar
                id="top-bar"
                app
                dense
                color="#3F8373"
                dark
              >
                <v-app-bar-nav-icon
                  @click="drawer = !drawer"
                >
                  <v-icon>device_hub</v-icon>
                </v-app-bar-nav-icon>
                <v-toolbar-title
                  class="pl-5"
                  @mouseover="focusMapNameInputForm"
                >
                  <v-text-field
                    ref="mapNameForm"
                    :value="mapToEdit.getName()"
                    @input="(value) => {mapToEdit.setName(value)}"
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
                        {{ mapToEdit.getName() }}
                      </span>
                </v-toolbar-title>
                <v-btn
                  icon
                  @click="dialog = true; setMapToStore()"
                >
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                  >cloud_upload</v-icon>
                </template>
                <span>アップロード</span>
              </v-tooltip>
                </v-btn>
              </v-app-bar>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-row justify="end" no-gutters>
                <EditorToolBar
                  class="pt-7"
                  @clickMove="setDefaultMethodOnMapClick"
                  @clickZoomIn="zoomIn"
                  @clickZoomOut="zoomOut"
                  @clickSelect="setDefaultMethodOnMapClick"
                  @clickSpot="setAddSpotMethodOnMapClick"
                  @switchMode="cancelShapeEditMode"
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
  z-index: 1100;
}

#map-info {
  z-index: 1100;
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
