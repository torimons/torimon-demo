import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Spot from '@/Spot/Spot';

@Component
export default class SpotEditor extends Vue {
    @Prop()
    public spot!: Spot;
    @Prop()
    public isVisible!: boolean;
    public attachment: [{name: string, url: string}] = [{name: '', url: ''}];
    public dialog: boolean = false;
}
