<template>
  <div id="editor-tool-bar">
    <v-card
        max-width="60"
    >
      <v-container fluid>
        <v-row>
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
                  :color="spotColor"
                  v-model="fabVisible"
                  icon
                >
                  <v-icon v-if="fabVisible">close</v-icon>
                  <v-icon v-if="!fabVisible && selectedMode != 'spot'">place</v-icon>
                  <v-icon v-if="!fabVisible && selectedMode == 'spot'">{{ selectedSpotIcon }}</v-icon>
                </v-btn>
              </template>
              <v-btn 
                color="primary"
                v-for="(spotIcon, index) in spotIcons"
                v-bind:key="index"
                fab
                small
                @click="onButtonClick('spot'); setSelectedSpotIcon(spotIcon)"
              >
                <v-icon>{{ spotIcon }}</v-icon>
              </v-btn>
            </v-speed-dial>
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
