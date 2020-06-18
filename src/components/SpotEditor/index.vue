<template>
  <div id="spot-editor" v-show="isVisible">
    <v-card
      outlined
    >
      <v-card-title>
        <v-text-field
          :value="spot.getName()"
          @input="(value) => spot.setName(value)"
          label="スポット名"
          :prepend-inner-icon="spot.getIconName()"
          clearable
          counter="15"
        ></v-text-field>
      </v-card-title>
      <v-card-subtitle>
        <v-textarea
          :value="spot.getDescription()"
          @input="(value) => spot.setDescription(value)"
          label="概要"
          clearable
          counter="100"
        ></v-textarea>
      </v-card-subtitle>
      <v-card-actions>
        <v-btn
            class="ma-1"
            color="#3FA590"
            outlined
            disabled
        >
            <span>形状</span>
            <v-icon right>add_circle</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
            class="ma-1"
            color="#3FA590"
            tile
            icon
            @click="$emit('close')"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts" src="./index.ts">
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-card {
  pointer-events: auto;
}
.v-text-field {
  pointer-events: auto;
}
</style>
