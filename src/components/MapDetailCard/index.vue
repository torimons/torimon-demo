<template>
    <v-app>
        <v-container>
            <v-row no-gutters>
                <v-col>
                    <v-dialog
                        v-model="mapDetailCardIsVisible"
                    >
                        <v-card>
                            <v-card-title>{{ name }}</v-card-title>
                            <v-card-text>{{ description }}</v-card-text>
                            <v-divider></v-divider>
                            <v-img
                                height="250"
                                src="https://picsum.photos/500"
                            ></v-img>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-btn
                                    text
                                    @click="close()"
                                >
                                    Close
                                </v-btn>
                                <v-spacer></v-spacer>
                                <router-link to="/">
                                    <v-btn
                                        text
                                        @click="openMap"
                                    >
                                        Open Map
                                    </v-btn>
                                </router-link>
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
