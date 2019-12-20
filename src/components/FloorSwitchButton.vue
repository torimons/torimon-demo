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
                        v-model="selectedFloorButtonIndex"
                    >
                        <v-btn
                            v-for="floorName in floorNames"
                            v-bind:key="floorName"
                            @click="updateLastViewedDetailMapIdOnClick(floorName)"
                        >
                        {{ floorName }}
                        </v-btn>
                    </v-btn-toggle>
                </v-col>
            </v-row>
        </v-container>
	</div>
</template>

<script lang="ts" src='./FloorSwitchButton.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#floor-switch-button {
    position:absolute;
    left: 10px;
    bottom: 10px;
    z-index: 1000;
}

.v-btn-toggle {
  flex-direction: column;
}
</style>
