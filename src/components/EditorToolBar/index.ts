import { Component, Vue, Emit } from 'vue-property-decorator';
import { SpotType } from '@/store/types';

@Component
export default class EditorToolBar extends Vue {
    // 色は仮
    private selectedColor: string = 'indigo darken-4';
    private defaultColor: string = 'light-blue lighten-1';
    private buttons: Array<{ action: Action, icon: string, color: string }> = [
        {action: 'move',    icon: 'pan_tool', color: this.selectedColor},
        {action: 'zoomIn',  icon: 'zoom_in',  color: this.defaultColor},
        {action: 'zoomOut', icon: 'zoom_out', color: this.defaultColor},
        {action: 'select',  icon: 'edit',     color: this.defaultColor},
    ];
    private spotButtonColor: string = this.defaultColor;
    private spotIcons: string[] = [
        'place',
        'add_location',
        'wc',
    ];
    private selectedMode: Action = 'move';
    private selectedSpotIcon: string = '';
    private fabVisible: boolean = false;

    /**
     * スポットボタンがクリックされた時にCreationMapViewにスポットの
     * SpotTypeをEmitするメソッド
     * @param selectedSpotIcon クリックで選ばれたスポットのSpotType
     */
    @Emit('clickSpot')
    private emitSpotType(selectedSpotIcon: string): SpotType {
        if (selectedSpotIcon === 'place') {
            return 'default';
        }
        if (selectedSpotIcon === 'add_location') {
            return 'withDetailMap';
        }
        if (selectedSpotIcon === 'wc') {
            return 'restroom';
        }
        throw new Error();
    }

    /**
     * ツールバーの各ボタンがクリックされた場合に実行される
     * CreationMapViewに選択されたボタンの種類をemitする
     * また現在選択されているボタンをモードとして保持する
     * @param action 選択されたボタンの種類
     */
    private onButtonClick(action: Action): void {
        if (action === 'zoomIn') {
            this.$emit('clickZoomIn');
            return;
        }
        if (action === 'zoomOut') {
            this.$emit('clickZoomOut');
            return;
        }
        this.switchMode(action);
        if (action === 'spot') {
            this.emitSpotType(this.selectedSpotIcon);
        }
        if (action === 'move') {
            this.$emit('clickMove');
        }
        if (action === 'select') {
            this.$emit('clickSelect');
        }
    }

    /**
     * 選択されているボタンの情報をモードとしてメンバ変数に反映する
     * ボタンの選択情報を色に反映する
     */
    private switchMode(action: Action): void {
        this.selectedMode = action;
        this.spotButtonColor = this.defaultColor;
        this.buttons.forEach((b) => b.color = this.defaultColor);
        if (action === 'spot') {
            this.spotButtonColor = this.selectedColor;
        } else {
            const index = this.buttons.findIndex((b) => b.action === action);
            this.buttons[index].color = this.selectedColor;
        }
    }

    /**
     * 選択されているスポットアイコンがどのスポットかをセットする
     */
    private setSelectedSpotIcon(icon: string): void {
        this.selectedSpotIcon = icon;
    }

}

type Action = 'move' | 'zoomIn' | 'zoomOut' | 'select' | 'spot';
