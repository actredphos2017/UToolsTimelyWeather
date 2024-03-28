import {RealtimeData} from "./realtime.ts";
import {MinutelyData} from "./minutely.ts";
import {HourlyData} from "./hourly.ts";
import {DailyData} from "./daily.ts";
import {AlertResult} from "./alert.ts";
import {defaultLongLatitude, LongLatitude, parseCaiyunLLFormat} from "../models.ts";
import axios from "axios"

export function getComprehensiveUrl(token: string, position: LongLatitude = defaultLongLatitude) {
    return `https://api.caiyunapp.com/v2.6/TAkhjf8d1nlSlspN/${parseCaiyunLLFormat(position)}/weather?alert=true&dailysteps=1&hourlysteps=24&token=${token}`
}

export async function getComprehensive(token: string, position: LongLatitude = defaultLongLatitude) {
    return new Promise<Comprehensive>((resolve, reject) => {
        if (/^\s*$/.test(token)) {
            reject({
                data: {
                    api_version: 'v2.6',
                    error: 'token is invalid'
                } as ComprehensiveErrorData
            })
        }
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
                reject(e.response)
            });
    });
}

export interface ComprehensiveErrorData {
    api_version: string;
    error: string | 'token is invalid' | "'latitude out of bounds!'";
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
    error?: string | 'token is invalid' | "'latitude out of bounds!'"
}

export interface ComprehensiveResult {
    alert: AlertResult,
    realtime: RealtimeData,
    minutely: MinutelyData,
    hourly: HourlyData,
    daily: DailyData,
    primary: number;
    forecast_keypoint: string;
}