import { Component, Vue } from 'vue-property-decorator';

@Component
export default class EditorToolBar extends Vue {
    private icons: string[] = [
        'pan_tool',
        'rotate_right',
        'rotate_left',
        'edit',
        'place',
    ];
    private fab: boolean = false;
    private spotIcons = [
        { text: '<i class="material-icons" style="font-size:32px;">place</i>' },
    ];
}

