import { weatherIconByKey } from "../utils/utils";


export const getWeatherIcon = (condition: string) => {
    return weatherIconByKey[condition] ?? weatherIconByKey.unknown;
}
