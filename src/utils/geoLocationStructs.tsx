export type GeoLocationResponse = {
    results: GeoLocationResult[];
}

export type GeoLocationResult = {
    name: string;
    latitude: number;
    longitude: number;
    timezone: string;
    country: string;
}

export type PixelCastError = {
    errorType: "API" | "Geolocation";
    message: string;
}