<template>
    <div id="spot-info" v-show="isVisible">
        <v-container class="pa-0">
            <v-card
                class="mx-auto"
                max-width="300"
                min-width="300"
                outlined
                >
                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title class="headline">{{ name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ description }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-card-actions>
                    <v-btn text>Button</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
