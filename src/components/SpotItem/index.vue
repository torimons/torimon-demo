<template>
	<div id="spot-item">
        <v-card
            tile
        >
            <v-list-item two-line>
                <v-list-item-content>
                    <div @click="moveMapViewToThisSpot()">
                    <v-list-item-title class="headline">{{ spotName }}</v-list-item-title>
                    <v-list-item-subtitle>{{ distance }}</v-list-item-subtitle>
                    </div>
                </v-list-item-content>
            </v-list-item>
        </v-card>
	</div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
