export class GeolocationWrapper {
    public static watchPosition(successCallback: PositionCallback, errorCallback?: PositionErrorCallback, options?: PositionOptions): number {
        return navigator.geolocation.watchPosition(
            successCallback,
            errorCallback,
            options,
        );
    } 
}
