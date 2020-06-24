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
        <v-dialog
            v-model="dialog"
            persistent
            no-click-animation
            max-width="500"
        >
            <v-card
                class="d-flex flex-column"
            >
                <v-card-title>{{ name }}</v-card-title>
                <v-card-text>{{ description }}</v-card-text>
                <v-divider></v-divider>
                <v-container>
                    <v-img
                        src="https://picsum.photos/500"
                        style="height: 40vh;"
                    ></v-img>
                </v-container>
                <v-divider></v-divider>
                <v-spacer></v-spacer>
                <v-card-actions>
                    <v-btn
                        id="close"
                        text
                        @click.stop="closeDialog"
                    >
                        Close
                    </v-btn>
                    <v-spacer></v-spacer>
                    <router-link to="/MainView">
                        <v-btn
                            id="openMap"
                            text
                            @click="openMap"
                        >
                            Open Map
                        </v-btn>
                    </router-link>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts" src='./index.ts'>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
