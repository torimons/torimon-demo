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
            <template v-slot:label="{ item }">
                <div
                    @click="item.type === 'Map'
                    ? sendMapToEdit(item.id) 
                    : sendSpotToEdit(item.id)"
                    @mouseover="item.hovered = true"
                    @mouseleave="item.hovered = false"
                >
                    {{ item.name }}
                </div>
            </template>
            <template v-slot:prepend="{ item }">
                <v-icon v-if="item.type==='Map'">
                    map
                </v-icon>
                <v-icon v-if="item.type==='Spot'">
                    place
                </v-icon>
            </template>
            <template v-slot:append="{ item }">
                <template v-if="item.hovered">
                    <v-btn icon>
                        <v-icon>file_copy</v-icon>
                    </v-btn>
                    <v-btn icon>
                        <v-icon>delete</v-icon>
                    </v-btn>
                </template>
            </template>
        </v-treeview>
    </div>
</template>

<script lang="ts" src="./index.ts"/>

<style scoped>
</style>