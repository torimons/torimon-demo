<template>
    <div id="spot-info" v-show="isVisible">
        <v-card
            outlined
        >
            <v-card-title>
                {{ name }}
            </v-card-title>
            <v-card-subtitle>
                {{ description }}
            </v-card-subtitle>
            <v-card-actions>
                <v-btn
                    class="ma-1"
                    color="accent"
                    outlined
                    disabled
                >
                    <v-icon left>call_split</v-icon>
                    <span>経路</span>
                </v-btn>
                <v-btn
                    class="ma-1"
                    color="accent"
                    outlined
                    disabled
                >
                    <v-icon left>info</v-icon>
                    <span>詳細</span>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    class="ma-1"
                    color="accent"
                    tile
                    icon
                    @click="closeSpotInfoCard"
                >
                    <v-icon>close</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#spot-info {
    pointer-events: auto;
}
</style>
