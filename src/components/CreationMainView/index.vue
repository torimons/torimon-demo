<template>
    <div id="creation-main-view">
      <CreationMapView/>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import CreationMapView from '@/components/CreationMapView/index.vue';


@Component({
    components: {
        CreationMapView,
    },
})
export default class CreationMainView extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body,
#creation-main-view {
  position: relative;
  height: 100%;
}

body {
  margin: 0;
}
</style>
