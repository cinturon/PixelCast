const iconsDir = "/icons/";
const imagesDir = "/images/";

export const getWeatherIcon = (condition: string) => {
    return weatherIconByKey[condition] ?? weatherIconByKey["Unknown"];
};

export const getImage = (condition: string) => {
    return imagesByKey[condition] ?? imagesByKey["Unknown"];
};

export const weatherIconByKey: Record<string, string> = {
    "Clear sky": iconsDir + "sunny.svg",
    "Mainly clear": iconsDir + "sunny.svg",
    "Partly cloudy": iconsDir + "partly_cloudy.svg",
    Overcast: iconsDir + "8-bit/rain_shower-8bit.png",
    Fog: iconsDir + "fog.svg",
    Drizzle: iconsDir + "drizzle.svg",
    "Freezing drizzle": iconsDir + "freezing_drizzle.svg",
    Rain: iconsDir + "rain.svg",
    "Freezing rain": iconsDir + "freezing_rain.svg",
    "Snow fall": iconsDir + "snow.svg",
    "Snow grains": iconsDir + "snow_grains.svg",
    "Rain showers": iconsDir + "16-bit/rain_showers.png",
    "Snow showers": iconsDir + "snow_showers.svg",
    Thunderstorm: iconsDir + "thunderstorm.svg",
    "Thunderstorm with hail": iconsDir + "thunderstorm_hail.svg",
    Unknown: iconsDir + "unknown.svg",
};

export const imagesByKey: Record<string, string> = {
    "Clear sky": imagesDir + "sunny.png",
    "Mainly clear": imagesDir + "sunny.png",
    "Partly cloudy": imagesDir + "overcast.png",
    Overcast: imagesDir + "overcast.png",
    Fog: imagesDir + "overcast.png",
    Drizzle: imagesDir + "heavy_rain.png",
    "Freezing drizzle": imagesDir + "heavy_rain.png",
    Rain: imagesDir + "heavy_rain.png",
    "Freezing rain": imagesDir + "heavy_rain.png",
    "Snow fall": imagesDir + "sunny.png",
    "Snow grains": imagesDir + "sunny.png",
    "Rain showers": imagesDir + "heavy_rain.png",
    "Snow showers": imagesDir + "sunny.png",
    Thunderstorm: imagesDir + "thunder.png",
    "Thunderstorm with hail": imagesDir + "thunder.png",
    Unknown: imagesDir + "sunny.png",
};
