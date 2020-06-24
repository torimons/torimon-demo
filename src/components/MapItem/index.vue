<template>
	<div id="spot-item">
        <v-card
            tile
        >
            <v-list-item two-line>
                <v-list-item-content>
                    <v-list-item-title class="headline">{{ mapName }}</v-list-item-title>
                    <v-list-item-subtitle>{{ userName }}</v-list-item-subtitle>
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
