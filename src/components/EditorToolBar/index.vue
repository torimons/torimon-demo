<template>
  <div id="editor-tool-bar">
    <v-card
        max-width="60"
    >
      <v-container fluid>
        <v-row>
          <v-col>
              <v-btn
                color="primary"
                icon
                class="mb-2"
                v-for="(mode, index) in modes"
                v-bind:key="index"
                @click="switchMode(mode.key)"
              >
              <v-icon icon>{{ mode.icon }}</v-icon>
            </v-btn>
            <v-speed-dial
              direction="left"
              v-model="fabVisible"
            >
              <template v-slot:activator>
                <v-btn
                  color="primary"
                  v-model="fabVisible"
                  icon
                >
                  <v-icon v-if="fabVisible">close</v-icon>
                  <v-icon v-if="!fabVisible && mode != 'spot'">place</v-icon>
                  <v-icon v-if="!fabVisible && mode == 'spot'">{{ selectedIcon }}</v-icon>
                </v-btn>
              </template>
              <v-btn 
                color="primary"
                v-for="(spotIcon, index) in spotIcons"
                v-bind:key="index"
                fab
                small
                @click="switchMode('spot'); setSelectedIcon(spotIcon)"
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
