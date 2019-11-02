<template>
    <div class="map">
        map
        <button v-on:click="setCurrentSpotID(1)">set</button>
        {{ spotId }}
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
    @map.Getter('getCurrentSpotID') 
    private spotId!: number;
    @map.Mutation('setCurrentSpotID')
    private setCurrentSpotID!: void;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
