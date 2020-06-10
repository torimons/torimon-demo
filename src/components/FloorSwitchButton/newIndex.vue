<template>
    <div id="floor-switch-button" v-show="isVisible">
        <v-container class="pa-0">
            <v-row
                no-gutters
            >
                <v-col>
                    <v-btn-toggle
                        tile
                        mandatory
                        color="primary"
                        v-model="selectedFloorButtonIndex"
                    >
                        <v-btn
                            v-for="(floorName, index) in floorNames"
                            v-bind:key="index"
                            @click="updateLastViewedDetailMapOnClick(index)"
                        >
                            {{ floorName }}
                        </v-btn>
                    </v-btn-toggle>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts" src='./newIndex.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-btn-toggle {
  flex-direction: column;
  pointer-events: auto;
}
</style>
