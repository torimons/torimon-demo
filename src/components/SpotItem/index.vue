<template>
	<div id="spot-item">
        <v-btn-toggle
            v-model="computedSpot"
        >
            <v-btn
                @click="updateFocusedSpot(computedSpot)"
            >
            {{ spotName }}
            {{ distance }}
            </v-btn>
        </v-btn-toggle>
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
