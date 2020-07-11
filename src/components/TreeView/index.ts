import { Component, Emit, Vue, Prop } from 'vue-property-decorator';

@Component
export default class TreeView extends Vue {
    @Prop()
    private items: any;
    private tree = [];

    @Emit('setMapToEdit')
    private sendMapToEdit(id: number) {
        return id;
    }

    @Emit('setSpotToEdit')
    private sendSpotToEdit(id: number) {
        return id;
    }
}
