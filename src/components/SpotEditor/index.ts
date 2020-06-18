import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { store, mapViewGetters, mapViewMutations } from '@/store';
import { MapViewGetters } from '@/store/modules/MapViewModule/MapViewGetters';
import { SpotInfo } from '@/store/types';
import Spot from '@/Spot/Spot';

@Component
export default class SpotEditor extends Vue implements SpotInfo {
    @Prop()
    public spot!: Spot;
    @Prop()
    public isVisible!: boolean;
    public name!: string;
    public description!: string;
    public attachment: [{name: string, url: string}] = [{name: '', url: ''}];
}
