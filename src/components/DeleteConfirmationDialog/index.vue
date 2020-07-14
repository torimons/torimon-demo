<template>
  <v-card>
    <v-card-title
      class="headline"
      primary-title
    >
      {{ name }}を削除しますか？
    </v-card-title>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn
        class="cancel"
        color="primary"
        text
        @click="cancelDeletion"
      >
        Cancel
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        class="delete"
        text
        color="warning"
        @click="confirmedDeletion"
      >
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" src="./index.ts"/>

<style scoped>
</style>