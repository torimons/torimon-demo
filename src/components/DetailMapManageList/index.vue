<template>
  <v-card>
    <v-list
      tile
      dense
      style="max-height:200px; overflow-y:auto;"
    >
      <v-list-item
        v-for="(detailMap, index) in detailMaps"
        :key="index"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ detailMap.getName() }}
          </v-list-item-title>
        </v-list-item-content>
        <v-btn icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="duplicateMap(detailMap)"
        >
          <v-icon>file_copy</v-icon>
        </v-btn>
        <v-btn
          icon
          @click.stop="confirmMapDeletion(detailMap)"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <delete-confirmation-dialog
        class="delete-confirmation"
        :name=selectedMapName
        @del="deleteMap"
        @cancel="cancelMapDeletion"
      ></delete-confirmation-dialog>
    </v-dialog>
    <v-card-actions>
      <v-btn
        block
        color="#3fa590"
        outlined
        @click="$emit('add')"
      >
        <v-icon>add</v-icon>
        add detail map
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" src="./index.ts"/>

<style scoped>
</style>