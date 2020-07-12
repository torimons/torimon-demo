<template>
  <div id="spot-editor" v-if="isVisible">
    <v-card
      flat
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
      </v-card-title>
      <v-card-subtitle>
        <v-textarea
          :value="spot.getDescription()"
          @input="(value) => spot.setDescription(value)"
          label="概要"
          clearable
          counter="100"
          auto-grow
          rows="1"
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
          @click="onClickShapeAddButton()"
        >
          <span>{{ shapeAddButtonName }}</span>
          <v-icon right v-show="!whileShapeEditing">{{ shapeAddButtonIcon() }}</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          class="ma-1"
          color="#3FA590"
          outlined
          @click.stop="dialog = true"
        >
            <span>削除</span>
            <v-icon right>delete</v-icon>
        </v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn
          block
          color="#3fa590"
          outlined
          :disabled="spot.getShape() === undefined"
          @click="addDetailMap"
        >
          <span>詳細マップ</span>
          <v-icon right>add</v-icon>
        </v-btn>
      </v-card-actions>
      <v-container id="delete-confirmation-dialog-container">
      <v-dialog
        v-model="dialog"
        width="500"
      >
        <delete-confirmation-dialog
          :name="spot.getName()"
          @del="dialog = false; $emit('delete')"
          @cancel="dialog = false"
        ></delete-confirmation-dialog>
      </v-dialog>
      </v-container>
      <detail-map-manage-list
        :detailMaps="spot.getDetailMaps()"
        @add="addDetailMap"
        @edit="editDetailMap"
        @dup="duplicateDetailMap"
        @del="deleteDetailMap"
      >
      </detail-map-manage-list>
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
#delete-confirmation-dialog-container {
  position: absolute;
  z-index: 1100;
}
</style>
