import {RealtimeResult} from "./realtime.ts";
import {MinutelyResult} from "./minutely.ts";
import {HourlyResult} from "./hourly.ts";
import {DailyResult} from "./daily.ts";
import {AlertResult} from "./alert.ts";
import {defaultLongLatitude, LongLatitude, parseCaiyunLLFormat} from "../models.ts";
import axios from "axios"

export function getComprehensiveUrl(token: string, position: LongLatitude = defaultLongLatitude) {
    return `https://api.caiyunapp.com/v2.6/TAkhjf8d1nlSlspN/${parseCaiyunLLFormat(position)}/weather?alert=true&dailysteps=1&hourlysteps=24&token=${token}`
}

export async function getComprehensive(token: string, position: LongLatitude = defaultLongLatitude) {
    return new Promise<Comprehensive>((resolve, reject) => {
        axios.get(getComprehensiveUrl(token, position))
            .then((response) => {
                const data = response.data as Comprehensive;
                if (data.status == 'ok') {
                    resolve(response.data as Comprehensive)
                } else {
                    reject(response)
                }
            })
            .catch(e => {
                reject(e)
            })
    })
}


export interface Comprehensive {
    status: 'ok' | 'failed';
    api_version: string;
    api_status: string;
    lang: string;
    unit: string;
    tzshift: number;
    timezone: string;
    server_time: number;
    location: number[];
    result: ComprehensiveResult;
}

export interface ComprehensiveResult {
    alert: AlertResult,
    realtime: RealtimeResult,
    minutely: MinutelyResult,
    hourly: HourlyResult,
    daily: DailyResult,
    primary: number;
    forecast_keypoint: string;
}