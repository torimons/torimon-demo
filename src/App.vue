<template>
    <div id="app">
        <CreationMainView/>
        <!-- <MainView/> -->
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import MainView from '@/components/MainView/index.vue';
import CreationMainView from '@/components/CreationMainView/index.vue';

@Component({
    components: {
        // MainView,
        CreationMainView,
    },
})
export default class App extends Vue {}
</script>

<style>
html,
body,
#app {
  height: 100%;
}
body {
  margin: 0;
}
</style>
