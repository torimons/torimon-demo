import { Component, Vue } from 'vue-property-decorator';

@Component
export default class EditorToolBar extends Vue {
    private icons: string[] = [
        'pan_tool',
        'rotate_right',
        'rotate_left',
        'editor',
        'place',
    ];
    private spotIcons = [
        { html: '<i class="material-icons" style="font-size:32px;">place</i>' },
    ];
}

