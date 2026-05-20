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