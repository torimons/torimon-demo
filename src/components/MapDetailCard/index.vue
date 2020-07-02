<template>
  <v-card
    class="d-flex flex-column"
  >
    <v-card-title>{{ name }}</v-card-title>
    <v-card-text>{{ description }}</v-card-text>
    <v-divider></v-divider>
    <v-container>
      <v-img
        :src="attachment"
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
      <router-link to="/MainView">
        <v-btn
          id="openMap"
          text
          @click="openMap"
        >
          Open Map
        </v-btn>
      </router-link>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" src="./index.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
