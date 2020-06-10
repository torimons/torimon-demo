import { Component, Vue } from 'vue-property-decorator';

@Component
export default class EditorToolBar extends Vue {
    private modes: Array<{ key: Mode, icon: string }> = [
        {key: 'move',   icon: 'pan_tool'},
        {key: 'rotate', icon: 'rotate_right'},
        {key: 'rotate', icon: 'rotate_left'},
        {key: 'select', icon: 'edit'},
    ];
    private spotIcons  = [
        'place',
        'add_location',
        'wc',
    ];
    private mode: Mode = 'move';
    private selectedIcon: string = '';
    private fabVisible: boolean = false;
    private switchMode(mode: Mode): void {
        this.mode = mode;
    }
    private setSelectedIcon(icon: string): void {
        this.selectedIcon = icon;
    }
}

type Mode = 'move' | 'rotate' | 'select' | 'spot';
