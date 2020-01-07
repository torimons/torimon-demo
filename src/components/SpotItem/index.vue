<template>
	<div id="spot-item">
        <v-col>
            <v-btn-toggle
                v-model="spotIds"
            >
                <v-btn
                    @click="updateFocusedSpot(spotIds)"
                >
                {{ spotName }}
                {{ distance }}
                </v-btn>
            </v-btn-toggle>
        </v-col>
	</div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#spot-item {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 1000;
}
</style>
