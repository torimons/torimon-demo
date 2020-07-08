<template>
    <div id='map'>
        <v-btn id="osm"
            absolute
            bottom
            right
            fab
            small
            @click="displayOSM = !displayOSM"
        >
            <v-icon
                v-if="displayOSM"
            >
                visibility_off
            </v-icon>
            <v-icon
                v-else
            >
                visibility
            </v-icon>
        </v-btn>

        <v-btn id="zoom-in"
            absolute
            bottom
            right
            fab
            small
            @click="zoomIn"
        >
            <v-icon>zoom_in</v-icon>
        </v-btn>
        <v-btn id="zoom-out"
            absolute
            bottom
            right
            fab
            small
            @click="zoomOut"
        >
            <v-icon>zoom_out</v-icon>
        </v-btn>
    </div>
</template>

<script lang='ts' src='./index.ts'/>


<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
html,
body,
#map {
    height: 100%;
}
#osm {
    bottom: 120px;
    z-index: 1000;
}
#zoom-in {
    bottom: 70px;
    z-index: 1000;
}
#zoom-out {
    bottom: 20px;
    z-index: 1000;
}
body {
    margin: 0;
    height: 100%;
}
</style>
