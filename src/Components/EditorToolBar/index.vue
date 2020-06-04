<template>
  <div id="editor-tool-bar">
    <v-card
        max-width="60"
    >
      <v-container fluid>
        <v-row>
          <v-col class="ml-auto">
              <v-btn
                icon
                color="primary"
                class="mb-2"
                v-for="(icon, index) in icons"
                v-bind:key="index"
              >
              <v-icon icon>{{ icon }}</v-icon>
            </v-btn>
            <v-speed-dial
              direction="left"
              v-model="fab"
            >
              <template v-slot:activator>
                <v-btn
                  v-model="fab"
                  icon
                >
                  <v-icon v-if="fab">close</v-icon>
                  <v-icon v-else>edit</v-icon>
                </v-btn>
              </template>
              <v-btn fab small>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn fab small>
                <v-icon>mdi-account-circle</v-icon>
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
