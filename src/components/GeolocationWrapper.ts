/**
 * navigator.geolocationのメソッドをテスト時にモックするためのラッパークラス
 */
export class GeolocationWrapper {
    /**
     * navigator.geolocation.watchPositionのラッパー
     * 現在地情報をウォッチできる  
     * @param successCallback 成功時に実行される関数
     * @param errorCallback 失敗時に実行される関数 
     * @param options オプション 
     */
    public static watchPosition(
        successCallback: PositionCallback, errorCallback?: PositionErrorCallback, options?: PositionOptions): number {
        return navigator.geolocation.watchPosition(
            successCallback,
            errorCallback,
            options,
        );
    }
}
