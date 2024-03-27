import {HourlyData} from "../models/caiyunapi/hourly.ts";
import {DailyData} from "../models/caiyunapi/daily.ts";

export function getTimeRoundToMinuteString(date: Date) {
    let h = date.getHours().toString();
    while (h.length < 2) {
        h = '0' + h;
    }
    let m = date.getMinutes().toString();
    while (m.length < 2) {
        m = '0' + m;
    }
    return `${h}:${m}`
}

export function formatDate(secondTimeMill: number | Date) {
    let date: Date;
    if (typeof secondTimeMill == "number") {
        date = new Date(secondTimeMill * 1000);
    } else {
        date = new Date(secondTimeMill);
    }
    const nowDate = new Date();

    if (
        date.getFullYear() == nowDate.getFullYear() &&
        date.getMonth() == nowDate.getMonth() &&
        date.getDate() == nowDate.getDate()
    ) {
        return `${date.getHours()}:${date.getMinutes()}`;
    }

    nowDate.setDate(nowDate.getDate() - 1);

    if (
        date.getFullYear() == nowDate.getFullYear() &&
        date.getMonth() == nowDate.getMonth() &&
        date.getDate() == nowDate.getDate()
    ) {
        return `昨天 ${getTimeRoundToMinuteString(date)}`;
    }

    return `${date.getMonth()}月${date.getDate()}日 ${getTimeRoundToMinuteString(date)}`;
}

const dayMapper = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
]


export function getFriendlyDateString(dateValue: string | Date | number) {
    const nowDate = new Date();
    const date = new Date(dateValue);

    if (
        date.getFullYear() == nowDate.getFullYear() &&
        date.getMonth() == nowDate.getMonth() &&
        date.getDate() == nowDate.getDate()
    ) {
        return '今天';
    }

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    if (
        date.getFullYear() == yesterdayDate.getFullYear() &&
        date.getMonth() == yesterdayDate.getMonth() &&
        date.getDate() == yesterdayDate.getDate()
    ) {
        return '昨天';
    }

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    if (
        date.getFullYear() == tomorrowDate.getFullYear() &&
        date.getMonth() == tomorrowDate.getMonth() &&
        date.getDate() == tomorrowDate.getDate()
    ) {
        return '明天';
    }

    return dayMapper[date.getDay()];
}


export interface HourlyInstance {
    date: Date,
    wind?: { speed: number, direction: number },
    visibility?: number,
    temperature?: number,
    skycon?: string,
    pressure?: number,
    precipitation?: { value: number, probability: number },
    humidity?: number,
    dswrf?: number,
    cloudrate?: number,
    apparent_temperature?: number,
    aqi?: { chn: number, usa: number },
    pm25?: number
}

export function getHourlyInstances(hourlyData: HourlyData): HourlyInstance[] {

    const tempRes = {} as { [key: string]: HourlyInstance };

    hourlyData.temperature.forEach(e => {
        tempRes[e.datetime] = {
            date: new Date(e.datetime),
            temperature: e.value
        };
    });

    hourlyData.wind.forEach(e => {
        if (tempRes[e.datetime]) {
            tempRes[e.datetime].wind = e
        }
    });

    hourlyData.visibility.forEach(e => {
        if (tempRes[e.datetime]) {
            tempRes[e.datetime].visibility = e.value
        }
    });

    hourlyData.skycon.forEach(e => {
        if (tempRes[e.datetime]) {
            tempRes[e.datetime].skycon = e.value
        }
    });

    hourlyData.pressure.forEach(e => {
        if (tempRes[e.datetime]) {
            tempRes[e.datetime].pressure = e.value
        }
    });

    hourlyData.precipitation.forEach(e => {
        if (tempRes[e.datetime]) {
            tempRes[e.datetime].precipitation = e
        }
    });

    hourlyData.humidity.forEach(e => {
        if (tempRes[e.datetime]) {
            tempRes[e.datetime].humidity = e.value
        }
    });

    hourlyData.dswrf.forEach(e => {
        if (tempRes[e.datetime]) {
            tempRes[e.datetime].dswrf = e.value
        }
    });

    hourlyData.cloudrate.forEach(e => {
        if (tempRes[e.datetime]) {
            tempRes[e.datetime].cloudrate = e.value
        }
    });

    hourlyData.apparent_temperature.forEach(e => {
        if (tempRes[e.datetime]) {
            tempRes[e.datetime].apparent_temperature = e.value
        }
    });

    hourlyData.air_quality.aqi.forEach(e => {
        if (tempRes[e.datetime]) {
            tempRes[e.datetime].aqi = e.value
        }
    });

    hourlyData.air_quality.pm25.forEach(e => {
        if (tempRes[e.datetime]) {
            tempRes[e.datetime].pm25 = e.value
        }
    });

    return Object.entries(tempRes).map(v => v[1]);
}


export interface DailyInstance {
    date: Date,
    aqi?: {
        max: {
            chn: number,
            usa: number
        },
        avg: {
            chn: number,
            usa: number
        },
        min: {
            chn: number,
            usa: number
        },
    },
    pm25?: {
        max: number,
        avg: number,
        min: number
    },
    astro?: {
        sunrise: {
            time: string
        },
        sunset: {
            time: string
        },
    },
    cloudrate?: {
        max: number,
        avg: number,
        min: number
    },
    dswrf?: {
        max: number,
        avg: number,
        min: number
    },
    humidity?: {
        max: number,
        avg: number,
        min: number
    },
    life_index?: {
        carWashing?: {
            index: string,
            desc: string,
        },
        coldRisk?: {
            index: string,
            desc: string,
        },
        comfort?: {
            index: string,
            desc: string,
        },
        dressing?: {
            index: string,
            desc: string,
        },
        ultraviolet?: {
            index: string,
            desc: string,
        },
    },
    precipitation?: {
        max: number,
        min: number,
        avg: number,
        probability: number
    },
    precipitation_08h_20h?: {
        max: number,
        min: number,
        avg: number,
        probability: number
    },
    precipitation_20h_32h?: {
        max: number,
        min: number,
        avg: number,
        probability: number
    },
    pressure?: {
        max: number,
        min: number,
        avg: number
    },
    skycon?: string,
    skycon_08h_20h?: string,
    skycon_20h_32h?: string,
    temperature?: {
        max: number,
        min: number,
        avg: number
    },
    temperature_08h_20h?: {
        max: number,
        min: number,
        avg: number
    },
    temperature_20h_32h?: {
        max: number,
        min: number,
        avg: number
    },
    visibility?: {
        max: number,
        min: number,
        avg: number
    },
    wind?: {
        max: {
            speed: number,
            direction: number,
        },
        min: {
            speed: number,
            direction: number,
        },
        avg: {
            speed: number,
            direction: number,
        }
    },
    wind_08h_20h?: {
        max: {
            speed: number,
            direction: number,
        },
        min: {
            speed: number,
            direction: number,
        },
        avg: {
            speed: number,
            direction: number,
        }
    },
    wind_20h_32h?: {
        max: {
            speed: number,
            direction: number,
        },
        min: {
            speed: number,
            direction: number,
        },
        avg: {
            speed: number,
            direction: number,
        }
    },
}

export function getDailyInstance(dailyData: DailyData): DailyInstance[] {
    const tempRes = {} as { [key: string]: DailyInstance };
    dailyData.skycon.forEach(e => {
        tempRes[e.date] = {
            date: new Date(e.date),
            skycon: e.value
        }
    });

    dailyData.astro.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].astro = e;
        }

    });

    dailyData.precipitation_08h_20h.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].precipitation_08h_20h = e;
        }

    });

    dailyData.precipitation_20h_32h.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].precipitation_20h_32h = e;
        }

    });

    dailyData.precipitation.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].precipitation = e;
        }

    });

    dailyData.temperature.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].temperature = e;
        }
    });

    dailyData.temperature_08h_20h.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].temperature_08h_20h = e;
        }
    });

    dailyData.temperature_20h_32h.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].temperature_20h_32h = e;
        }
    });

    dailyData.wind.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].wind = e;
        }
    });

    dailyData.wind_08h_20h.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].wind_08h_20h = e;
        }
    });

    dailyData.wind_20h_32h.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].wind_20h_32h = e;
        }
    });

    dailyData.humidity.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].humidity = e;
        }
    });

    dailyData.cloudrate.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].cloudrate = e;
        }
    });

    dailyData.pressure.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].pressure = e;
        }
    });

    dailyData.visibility.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].visibility = e;
        }
    });

    dailyData.dswrf.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].dswrf = e;
        }
    });

    dailyData.air_quality.aqi.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].aqi = e
        }
    });

    dailyData.air_quality.pm25.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].pm25 = e
        }
    });

    dailyData.skycon_08h_20h.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].skycon_08h_20h = e.value
        }
    });

    dailyData.skycon_20h_32h.forEach(e => {
        if (tempRes[e.date]) {
            tempRes[e.date].skycon_20h_32h = e.value
        }
    });

    dailyData.life_index.ultraviolet.forEach(e => {
        tempRes[e.date].life_index = {};
        if (tempRes[e.date].life_index) {
            tempRes[e.date].life_index!.ultraviolet = e;
        }
    });

    dailyData.life_index.carWashing.forEach(e => {
        tempRes[e.date].life_index = {};
        if (tempRes[e.date].life_index) {
            tempRes[e.date].life_index!.carWashing = e;
        }
    });

    dailyData.life_index.dressing.forEach(e => {
        tempRes[e.date].life_index = {};
        if (tempRes[e.date].life_index) {
            tempRes[e.date].life_index!.dressing = e;
        }
    });

    dailyData.life_index.comfort.forEach(e => {
        tempRes[e.date].life_index = {};
        if (tempRes[e.date].life_index) {
            tempRes[e.date].life_index!.comfort = e;
        }
    });

    dailyData.life_index.coldRisk.forEach(e => {
        tempRes[e.date].life_index = {};
        if (tempRes[e.date].life_index) {
            tempRes[e.date].life_index!.coldRisk = e;
        }
    });

    return Object.entries(tempRes).map(e => e[1]);
}

export function parseWindLevelDescription(windSpeed: number): { levelName: string, desc: string } {
    let levelName: string;
    let desc: string;

    if (windSpeed < 1) {
        levelName = "0 级";
        desc = "无风";
    } else if (windSpeed >= 1 && windSpeed < 6) {
        levelName = "1 级";
        desc = "微风";
    } else if (windSpeed >= 6 && windSpeed < 12) {
        levelName = "2 级";
        desc = "清风";
    } else if (windSpeed >= 12 && windSpeed < 20) {
        levelName = "3 级";
        desc = "叶摇";
    } else if (windSpeed >= 20 && windSpeed < 29) {
        levelName = "4 级";
        desc = "枝摇";
    } else if (windSpeed >= 29 && windSpeed < 39) {
        levelName = "5 级";
        desc = "强劲";
    } else if (windSpeed >= 39 && windSpeed < 50) {
        levelName = "6 级";
        desc = "强劲";
    } else if (windSpeed >= 50 && windSpeed < 62) {
        levelName = "7 级";
        desc = "超强";
    } else if (windSpeed >= 62 && windSpeed < 75) {
        levelName = "8 级";
        desc = "狂风";
    } else if (windSpeed >= 75 && windSpeed < 89) {
        levelName = "9 级";
        desc = "风啸";
    } else if (windSpeed >= 89 && windSpeed < 103) {
        levelName = "10 级";
        desc = "暴风";
    } else if (windSpeed >= 103 && windSpeed < 118) {
        levelName = "11 级";
        desc = "暴风";
    } else if (windSpeed >= 118 && windSpeed < 134) {
        levelName = "12 级";
        desc = "飓风";
    } else if (windSpeed >= 134 && windSpeed < 150) {
        levelName = "13 级";
        desc = "台风";
    } else if (windSpeed >= 150 && windSpeed < 167) {
        levelName = "14 级";
        desc = "强台风";
    } else if (windSpeed >= 167 && windSpeed < 184) {
        levelName = "15 级";
        desc = "强台风";
    } else if (windSpeed >= 184 && windSpeed < 202) {
        levelName = "16 级";
        desc = "超强台风";
    } else if (windSpeed >= 202 && windSpeed <= 220) {
        levelName = "17 级";
        desc = "超强台风";
    } else {
        levelName = "未知";
        desc = "未知";
    }

    return { levelName, desc };
}