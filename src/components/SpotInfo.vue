<template>
    <div class="spot-info">
        <p>{{ spot_name }}</p>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class SpotInfo extends Vue {

    private spot_name: string = '';
    private others: Object = {};

    private get currentSpotID(): number {
        return this.$store.getters.getCurrentSpotID;
    }

    // currentSpotIDの変更を検知したら，spot_name, othersを更新する
    @Watch('currentSpotID')
    private spotIDChanged() {
        let spot = this.$store.getters.getInfoOfCurrentSpot;
        if (spot) {
            this.spot_name = spot.name;
            this.others = spot.others;
        } else {
            this.spot_name = "no_name";
            this.others = {};
        }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
