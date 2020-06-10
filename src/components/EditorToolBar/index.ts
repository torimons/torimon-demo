import { Component, Vue } from 'vue-property-decorator';

@Component
export default class EditorToolBar extends Vue {
    private icons: string[] = [
        'pan_tool',
        'rotate_right',
        'rotate_left',
        'edit',
    ];
    private spotIcons = [
        'place',
        'add_location',
        'wc',
    ];
    private fabVisible: boolean = false;
}

