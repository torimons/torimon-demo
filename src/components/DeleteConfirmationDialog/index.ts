import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class DeleteConfirmationDialog extends Vue {
    @Prop() public name!: string;

    /**
     * 削除ボタンを押すと呼び出され、削除イベントを発火する。
     */
    private confirmedDeletion(): void {
        this.$emit('del');
    }

    /**
     * キャンセルボタンを押すと呼び出され、キャンセルイベントを発火する。
     */
    private cancelDeletion(): void {
        this.$emit('cancel');
    }

}
