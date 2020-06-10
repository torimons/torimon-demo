import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { store, mapViewGetters, mapViewMutations } from '@/store';
import { MapViewGetters } from '@/store/modules/MapViewModule/MapViewGetters';
import { SpotInfo } from '@/store/types';

@Component
export default class SpotEditor extends Vue implements SpotInfo {
    public name: string = '';
    public description: string = '';
    public attachment: [{name: string, url: string}] = [{name: '', url: ''}];
}
