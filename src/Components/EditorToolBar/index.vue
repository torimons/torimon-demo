<template>
    <div id="editor-tool-bar">
      <v-container class="pa-0">
            <v-row
                no-gutters
            >
                <v-col>
                    <v-btn-toggle
                        tile
                        mandatory
                        color="primary"
                    >
                        <v-btn>
                            hoge
                        </v-btn>
                        <v-btn>
                            hoge
                        </v-btn>
                        <v-btn>
                            hoge
                        </v-btn>
                    </v-btn-toggle>
                </v-col>
            </v-row>
        </v-container>
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
</style>
