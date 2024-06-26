export type TimeRange = 'TIME_MORNING' | 'TIME_SUNSET' | 'TIME_NIGHT' | 'TIME_NORMAL';

function parseTimeRange(timestampInSeconds: number): TimeRange {
    const time = new Date(timestampInSeconds * 1000); // Convert seconds to milliseconds

    const minSum = time.getHours() * 60 + time.getMinutes();

    if (minSum >= 5 * 60 + 30 && minSum < 7 * 60) {
        return 'TIME_MORNING';
    } else if (minSum >= 7 * 60 && minSum < 16 * 60 + 30) {
        return 'TIME_NORMAL';
    } else if (minSum >= 16 * 60 + 30 && minSum < 19 * 60) {
        return 'TIME_SUNSET';
    } else {
        return 'TIME_NIGHT';
    }
}

function bg(id: string) {
    return new URL(`../assets/weather_backgrounds/${id}.jpg`, import.meta.url).href
}

function ic(id: string) {
    return new URL(`../assets/weather_icons/${id}.png`, import.meta.url).href
}

const sunnyBackground = (timestampInSeconds: number) => {
    switch (parseTimeRange(timestampInSeconds)) {
        case "TIME_MORNING":
            return bg('background_sunny_morning');
        case "TIME_SUNSET":
            return bg('background_sunny_sunset');
        case "TIME_NIGHT":
            return bg('background_sunny_night');
        default:
            return bg('background_sunny_normal');
    }
}

const cloudyBackground = (timestampInSeconds: number) => {
    switch (parseTimeRange(timestampInSeconds)) {
        case "TIME_MORNING":
            return bg('background_cloudy_morning');
        case "TIME_SUNSET":
            return bg('background_cloudy_sunset');
        case "TIME_NIGHT":
            return bg('background_cloudy_night');
        default:
            return bg('background_cloudy_normal');
    }
}

const overcastBackground = (timestampInSeconds: number) => {
    switch (parseTimeRange(timestampInSeconds)) {
        case "TIME_MORNING":
            return bg('background_overcast_morning');
        case "TIME_NIGHT":
            return bg('background_overcast_night');
        case "TIME_SUNSET":
            return bg('background_overcast_sunset');
        default:
            return bg('background_overcast_normal');
    }
}

const rainyBackground = (timestampInSeconds: number) => {
    switch (parseTimeRange(timestampInSeconds)) {
        case "TIME_MORNING":
            return bg('background_rainy_morning');
        case "TIME_SUNSET":
            return bg('background_rainy_sunset');
        case "TIME_NIGHT":
            return bg('background_rainy_night');
        default:
            return bg('background_rainy_normal');
    }
}

const thunderBackground = (timestampInSeconds: number) => {
    switch (parseTimeRange(timestampInSeconds)) {
        case "TIME_MORNING":
            return bg('background_thunder_morning');
        case "TIME_NIGHT":
            return bg('background_thunder_night');
        case "TIME_SUNSET":
            return bg('background_thunder_sunset');
        default:
            return bg('background_thunder_normal');
    }
}

const snowyBackground = (timestampInSeconds: number) => {
    switch (parseTimeRange(timestampInSeconds)) {
        case "TIME_MORNING":
            return bg('background_snowy_morning');
        case "TIME_NIGHT":
            return bg('background_snowy_night');
        case "TIME_SUNSET":
            return bg('background_snowy_sunset');
        default:
            return bg('background_snowy_normal');
    }
}

const hazeBackground = (timestampInSeconds: number) => {
    switch (parseTimeRange(timestampInSeconds)) {
        case "TIME_NIGHT":
            return bg('background_haze_night');
        default:
            return bg('background_haze_normal');
    }
}

const blackBackground = sunnyBackground;

export function parseWeatherBackground(skycon: string, timestampInSeconds: number) {
    switch (skycon) {
        case "CLEAR_DAY":
        case "CLEAR_NIGHT":
            return sunnyBackground(timestampInSeconds);
        case "PARTLY_CLOUDY_DAY":
        case "PARTLY_CLOUDY_NIGHT":
        case "CLOUDY":
        case "WIND":
            return cloudyBackground(timestampInSeconds);
        case "FOG":
            return overcastBackground(timestampInSeconds);
        case "LIGHT_HAZE":
        case "MODERATE_HAZE":
        case "HEAVY_HAZE":
        case "DUST":
        case "SAND":
            return hazeBackground(timestampInSeconds);
        case "LIGHT_RAIN":
        case "MODERATE_RAIN":
            return rainyBackground(timestampInSeconds);
        case "STORM_RAIN":
        case "HEAVY_RAIN":
            return thunderBackground(timestampInSeconds);
        case "LIGHT_SNOW":
        case "MODERATE_SNOW":
        case "HEAVY_SNOW":
        case "STORM_SNOW":
            return snowyBackground(timestampInSeconds);
        default:
            return blackBackground(timestampInSeconds);
    }
}

export function parseWeatherName(code: string | undefined): string {
    switch (code) {
        case 'CLEAR_DAY':
        case 'CLEAR_NIGHT':
            return '晴';
        case 'PARTLY_CLOUDY_DAY':
        case 'PARTLY_CLOUDY_NIGHT':
            return '多云';
        case 'CLOUDY':
            return '阴';
        case 'LIGHT_HAZE':
            return '轻度雾霾';
        case 'MODERATE_HAZE':
            return '中度雾霾';
        case 'HEAVY_HAZE':
            return '重度雾霾';
        case 'LIGHT_RAIN':
            return '小雨';
        case 'MODERATE_RAIN':
            return '中雨';
        case 'HEAVY_RAIN':
            return '大雨';
        case 'STORM_RAIN':
            return '暴雨';
        case 'FOG':
            return '雾';
        case 'LIGHT_SNOW':
            return '小雪';
        case 'MODERATE_SNOW':
            return '中雪';
        case 'HEAVY_SNOW':
            return '大雪';
        case 'STORM_SNOW':
            return '暴雪';
        case 'DUST':
            return '浮尘';
        case 'SAND':
            return '沙尘';
        case 'WIND':
            return '大风';
        default:
            return '未知天气';
    }
}

export function parseWeatherIcon(weatherCode: string | undefined): string {
    switch(weatherCode) {
        case 'CLEAR_DAY': return ic('sunny_icon');
        case 'CLEAR_NIGHT': return ic('sunny_night_icon');
        case 'PARTLY_CLOUDY_DAY':
        case 'PARTLY_CLOUDY_NIGHT': return ic('cloudy_icon');
        case 'CLOUDY': return ic('overcoat_icon');
        case 'LIGHT_HAZE':
        case 'MODERATE_HAZE':
        case 'HEAVY_HAZE': return ic('haze_icon');
        case 'LIGHT_RAIN': return ic('small_rainy_icon');
        case 'MODERATE_RAIN': return ic('middle_rainy_icon');
        case 'HEAVY_RAIN': return ic('big_rainy_icon');
        case 'STORM_RAIN': return ic('thunder_rainy_icon');
        case 'FOG': return ic('foggy_icon');
        case 'LIGHT_SNOW': return ic('small_snowy_icon');
        case 'MODERATE_SNOW': return ic('middle_snowy_icon');
        case 'HEAVY_SNOW':
        case 'STORM_SNOW': return ic('big_snowy_icon');
        case 'DUST':
        case 'SAND': return ic('dust_icon');
        case 'WIND': return ic('wind_icon');
        default: return ic('sunny_icon');
    }
}