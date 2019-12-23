import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class FloorSwitchButton extends Vue {
    private floorNames: string[] = [];
    public mounted() {
        this.floorNames = ['1F', '2F', '3F', '4F', '5F'];
    }
}
