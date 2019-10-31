<template>
    <div class="spot-info" v-show="visible">
        <p>{{ spot_name }}</p>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class SpotInfo extends Vue {

    private spotName: string = '';
    private others: any = {};
    private visible: boolean = false;

    private get currentSpotID(): number {
        return this.$store.getters.getCurrentSpotID;
    }

    private get spotInfoVisible(): boolean {
        return this.$store.getters.getSpotInfoVisible;
    }

    // currentSpotIDの変更を検知したら，spot_name, othersを更新する
    @Watch('currentSpotID')
    private spotIDChanged(): void {
        let spot: any = this.$store.getters.getInfoOfCurrentSpot;
        if (spot) {
            this.spotName = spot.name;
            this.others = spot.others;
        } else {
            this.spotName = "no_name";
            this.others = {};
        }
    }

    @Watch('spotInfoVisible')
    private spotInfoVisibleChanged(): void {
        this.visible = this.$store.getters.getSpotInfoVisible;
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
