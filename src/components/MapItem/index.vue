<template>
	<div id="map-item">
        <v-card
            tile
            @click.stop="openDialog()"
        >
            <v-list-item two-line>
                <v-list-item-content>
                    <v-list-item-title class="headline">{{ name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ description }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-card>
        <map-detail-card
            ref="mapDialog"
            :map="map"
        ></map-detail-card>
    </div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
