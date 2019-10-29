<template>
    <div class="map">
        map
        <button v-on:click="setCurrentSpotID('hoge')">set</button>
        {{ spotID }}
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { 
    State, 
    Action, 
    Getter, 
    Mutation,
    namespace,
} from 'vuex-class';
const map = namespace('map');

@Component
export default class Map extends Vue {
    @map.Getter('name') 
    private name!: string;
    @map.Getter('currentSpotID') 
    private spotID!: string;
    @map.Mutation('setCurrentSpotID')
    private setCurrentSpotID!: void;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
