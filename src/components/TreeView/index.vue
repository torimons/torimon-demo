<template>
    <div id="tree-view">
        <v-treeview
            hoverable
            open-all
            v-model="tree"
            :items="items"
            item-key="name"
            dense
        >
            <template v-slot:prepend="{ item }">
                <div
                    @click="item.type === 'Map'
                    ? sendMapToEdit(item.id) 
                    : sendSpotToEdit(item.id)"
                >
                    <v-btn icon v-if="item.type==='Map'">
                        <v-icon>map</v-icon>
                    </v-btn>
                    <v-btn icon v-if="item.type==='Spot'">
                        <v-icon>place</v-icon>
                    </v-btn>
                </div>
            </template>
        </v-treeview>
    </div>
</template>

<script lang="ts" src="./index.ts"/>

<style scoped>
</style>