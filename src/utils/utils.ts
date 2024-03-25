import {HourlyData} from "../models/caiyunapi/hourly.ts";

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

export function formatDate(secondTimeMill: number) {
    const date = new Date(secondTimeMill * 1000);
    const nowDate = new Date();

    if (
        date.getFullYear() == nowDate.getFullYear() &&
        date.getMonth() == nowDate.getMonth() &&
        date.getDay() == nowDate.getDay()
    ) {
        return `${date.getHours()}:${date.getMinutes()}`;
    }

    nowDate.setDate(nowDate.getDate() - 1);

    if (
        date.getFullYear() == nowDate.getFullYear() &&
        date.getMonth() == nowDate.getMonth() &&
        date.getDay() == nowDate.getDay()
    ) {
        return `昨天 ${getTimeRoundToMinuteString(date)}`;
    }

    return `${date.getMonth()}月${date.getDay()}日 ${getTimeRoundToMinuteString(date)}`;
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

    const tempRes = {} as {[key: string]: HourlyInstance};

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