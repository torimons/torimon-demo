<template>
    <div id="tree-view">
        <v-treeview
            v-if="isExpanded"
            hoverable
            open-all
            v-model="tree"
            :items="items"
            item-key="id"
            dense
            activatable
            @update:active="nodeClick"
        >
            <template v-slot:label="{ item }">
                <v-hover v-slot:default="{ hover }">
                    <div>
                        <span v-if="item.name.length < 10">{{ item.name }}</span>
                        <span v-else>{{ item.name.substring(0, 10) }}...</span>
                        <template v-if="item.type === 'Map' && item.id !== 0">
                            <v-btn icon
                                v-if="hover"
                                @click.stop="confirmMapDeletion(item)"
                            >
                                <v-icon>delete</v-icon>
                            </v-btn>
                            <v-btn icon
                                v-if="hover"
                                @click.stop="sendMapToDuplicate(item.id)"
                            >
                                <v-icon>file_copy</v-icon>
                            </v-btn>
                        </template>
                    </div>
                </v-hover>
            </template>
            <template v-slot:prepend="{ item }">
                <v-icon v-if="item.type==='Map'">
                    map
                </v-icon>
                <v-icon v-if="item.type==='Spot'">
                    {{ item.iconName }}
                </v-icon>
            </template>
        </v-treeview>
        <v-container id="delete-confirmation-dialog-container">
            <v-dialog v-model="dialog" width="500">
                <delete-confirmation-dialog
                    class="delete-confirmation"
                    :name="selectedMapName"
                    @del="deleteMap"
                    @cancel="cancelMapDeletion"
                ></delete-confirmation-dialog>
            </v-dialog>
        </v-container>
    </div>
</template>

<script lang="ts" src="./index.ts"/>

<style scoped>
.appendRight {
    float: right;
}
#delete-confirmation-dialog-container {
  position: absolute;
  z-index: 1100;
}
</style>