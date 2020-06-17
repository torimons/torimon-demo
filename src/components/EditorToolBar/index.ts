import { Component, Vue, Emit } from 'vue-property-decorator';
import { SpotType } from '@/store/types';

@Component
export default class EditorToolBar extends Vue {

    private selectedColor: string = 'indigo darken-4';
    private defaultColor: string = 'light-blue lighten-1';
    private buttons: Array<{ action: Action, icon: string, color: string }> = [
        {action: 'move',    icon: 'pan_tool', color: this.selectedColor},
        {action: 'zoomIn',  icon: 'zoom_in',  color: this.defaultColor},
        {action: 'zoomOut', icon: 'zoom_out', color: this.defaultColor},
        {action: 'select',  icon: 'edit',     color: this.defaultColor},
    ];
    private spotColor: string = this.defaultColor;
    private spotIcons: string[] = [
        'place',
        'add_location',
        'wc',
    ];
    private selectedMode: Action = 'move';
    private selectedSpotIcon: string = '';
    private fabVisible: boolean = false;

    @Emit('spot')
    private hoge(selectedSpotIcon: string): SpotType {
        if (selectedSpotIcon === 'place') {
            return 'default';
        }
        if (selectedSpotIcon === 'add_location') {
            return 'withDetailMap';
        }
        if (selectedSpotIcon === 'place') {
            return 'restroom';
        }
        throw new Error();
    }

    private onButtonClick(action: Action): void {
        if (action === 'zoomIn') {
            this.$emit('zoomIn');
            return;
        }
        if (action === 'zoomOut') {
            this.$emit('zoomOut');
            return;
        }
        this.switchMode(action);
        if (action === 'spot') {
            this.hoge(this.selectedSpotIcon);
        }
        if (action === 'move') {
            this.$emit('move');
        }
        if (action === 'select') {
            this.$emit('select');
        }
    }

    private switchMode(action: Action): void {
        this.selectedMode = action;
        this.spotColor = this.defaultColor;
        this.buttons.forEach((b) => b.color = this.defaultColor);
        if (action === 'spot') {
            this.spotColor = this.selectedColor;
        } else {
            const index = this.buttons.findIndex((b) => b.action === action);
            this.buttons[index].color = this.selectedColor;
        }
    }

    private setSelectedSpotIcon(icon: string): void {
        this.selectedSpotIcon = icon;
    }

}

type Action = 'move' | 'zoomIn' | 'zoomOut' | 'select' | 'spot';
