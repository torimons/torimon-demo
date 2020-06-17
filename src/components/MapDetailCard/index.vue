<template>
    <v-app>
        <v-container>
            <v-row no-gutters>
                <v-col>
                    <v-btn @click.stop="dialog = ! dialog">
                        Open
                    </v-btn>
                    <v-dialog
                        v-model="dialog"
                        hide-overlay
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
                                    @click="close"
                                >
                                    Close
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    @click="openMap"
                                    to="/mainview"
                                >
                                    Open Map
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
