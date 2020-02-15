<template>
    <div id="app">
        <MainView/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MainView from '@/components/MainView/index.vue';

@Component({
    components: {
        MainView,
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
