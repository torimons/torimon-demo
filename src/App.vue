<template>
    <div id="app">
        <MainCreationView/>
        <!-- <MainView/> -->
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import MainView from '@/components/MainView/index.vue';
import MainCreationView from '@/components/MainCreationView/index.vue';

@Component({
    components: {
        // MainView,
        MainCreationView,
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
