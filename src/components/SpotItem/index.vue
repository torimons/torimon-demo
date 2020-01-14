<template>
	<div id="spot-item">
<<<<<<< HEAD
        <v-btn
            @click="updateFocusedSpot()"
        >
        {{ spotName }}
        {{ distance }}
        </v-btn>
=======
        <v-card
            tile
        >
            <v-list-item two-line>
                <v-list-item-content>
                    <v-list-item-title class="headline">{{ spotName }}</v-list-item-title>
                    <v-list-item-subtitle>{{ distance }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-card>
>>>>>>> 338c5cb405f38f50fb0fbbabc3cf9e17486f5b3e
	</div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
