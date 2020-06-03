<template>
    <div id="editor-tool-bar">
        <v-btn-toggle
            tile
            mandatory
            color="primary"
        >
            <!-- <v-overflow-btn
            :items="spotIcons"
            label="s"
            hide-details
            class="pa-0"
            > </v-overflow-btn> -->

            <v-btn
                v-for="(icon, index) in icons"
                v-bind:key="index"
            >
                <i class="material-icons" style="font-size:32px;">{{ icon }}</i>
            </v-btn>
        </v-btn-toggle>
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
