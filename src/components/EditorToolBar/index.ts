import { Component, Vue, Emit } from 'vue-property-decorator';

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

    @Emit('zoomIn')
    public callZoomIn(): boolean {
        return true;
    }

    @Emit('zoomOut')
    public callZoomOut(): boolean {
        return true;
    }

    private onButtonClick(action: Action): void {
        if (action === 'zoomIn') {
            this.callZoomIn();
            return;
        }
        if (action === 'zoomOut') {
            this.callZoomOut();
            return;
        }
        this.switchMode(action);
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
