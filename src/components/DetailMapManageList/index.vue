<template>
  <v-card>
    <v-list
      tile
      dense
      style="max-height:200px; overflow-y:auto;"
      v-show="detailMaps && detailMaps.length > 0"
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
        <v-btn
          icon
          @click="editDetailMap(detailMap)"
        >
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
  </v-card>
</template>

<script lang="ts" src="./index.ts"/>

<style scoped>
</style>