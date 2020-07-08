<template>
  <div id="editor-tool-bar">
    <v-card
        max-width="60"
    >
      <v-container fluid>
        <v-row no-gutters>
          <v-col>
            <v-btn
              icon
              class="mb-2"
              v-for="(button, index) in buttons"
              v-bind:key="index"
              :color="button.color"
              @click="onButtonClick(button.action)"
            >
              <v-icon icon>{{ button.icon }}</v-icon>
            </v-btn>
            <v-speed-dial
              direction="left"
              v-model="fabVisible"
            >
              <template v-slot:activator>
                <v-btn
                  :color="spotButtonColor"
                  v-model="fabVisible"
                  v-show="spotButtonIsVisible"
                  icon
                >
                  <v-icon v-if="fabVisible">close</v-icon>
                  <v-icon v-if="!fabVisible && selectedMode != 'spot'">add_location</v-icon>
                  <v-icon v-if="!fabVisible && selectedMode == 'spot'">{{ selectedSpotIcon }}</v-icon>
                </v-btn>
              </template>
              <v-btn 
                color="#3F8373"
                v-for="(spotIconMap, index) in spotIconMaps"
                v-bind:key="index"
                fab
                small
                dark
                @click="setSelectedSpotIcon(spotIconMap.iconName); onButtonClick('spot')"
              >
                <v-icon>{{ spotIconMap.iconName }}</v-icon>
              </v-btn>
            </v-speed-dial>
            <v-btn
              icon
              class="mt-1"
              v-show="shapeEditButtonIsVisible"
              :color="shapeEditButton.color"
              @click="onButtonClick(shapeEditButton.action)"
            >
              <v-icon icon>{{ shapeEditButton.icon }}</v-icon>
            </v-btn>
          </v-col> 
        </v-row> 
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts" src="./index.ts">
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-btn-toggle {
  flex-direction: column;
  pointer-events: auto;
}
.v-btn {
  flex-direction: column;
  pointer-events: auto;
}
</style>
