<template>
  <div id="spot-editor" v-show="isVisible">
    <v-card
      outlined
    >
      <v-card-title>
        <v-text-field
          :value="spot.getName()"
          @input="(value) => {spot.setName(value); $emit('spotInput');}"
          label="スポット名"
          :prepend-inner-icon="spot.getIconName()"
          clearable
          counter="15"
        ></v-text-field>
        <v-checkbox
          label="マップ上に表示"
          color="#3fa590"
        ></v-checkbox>
      </v-card-title>
      <v-card-subtitle>
        <v-textarea
          :value="spot.getDescription()"
          @input="(value) => spot.setDescription(value)"
          label="概要"
          clearable
          counter="100"
        ></v-textarea>
        <v-file-input
          multiple
          label="画像"
          prepend-icon="mdi-camera"
        ></v-file-input>
      </v-card-subtitle>
      <v-card-actions>
        <v-btn
            class="ma-1"
            color="#3fa590"
            outlined
            disabled
        >
            <span>形状</span>
            <v-icon right>add_circle</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                class="ma-1"
                color="#3FA590"
                outlined
                v-bind="attrs"
                v-on="on"
            >
                <span>削除</span>
                <v-icon right>delete</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title
              class="headline"
              primary-title
            >
              {{ spot.getName() }}を削除しますか？
            </v-card-title>


            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="dialog = false; $emit('delete')"
              >
                Delete
              </v-btn>
              <v-btn
                color="secondary"
                text
                @click="dialog = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          v-for="(map, index) in spot.getDetailMaps()"
          :key="index"
        >
          <v-list-item-content>
            <v-list-item-title v-text="map.getId()"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon>
              <v-icon color="grey lighten-1">mdi-information</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-btn
          text
          @click="$emit('add')"
        >
        <v-icon>add</v-icon>
          new map
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
