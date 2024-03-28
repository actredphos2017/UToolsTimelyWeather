import {RealtimeData} from "./realtime.ts";
import {MinutelyData} from "./minutely.ts";
import {HourlyData} from "./hourly.ts";
import {DailyData} from "./daily.ts";
import {AlertResult} from "./alert.ts";
import {defaultLongLatitude, LongLatitude, parseCaiyunLLFormat} from "../models.ts";
import axios from "axios"

export function getComprehensiveUrl(token: string, position: LongLatitude = defaultLongLatitude) {
    return `https://api.caiyunapp.com/v2.6/TAkhjf8d1nlSlspN/${parseCaiyunLLFormat(position)}/weather?alert=true&dailysteps=14&hourlysteps=24&token=${token}`
}

export async function getComprehensive(token: string, position: LongLatitude = defaultLongLatitude): Promise<Comprehensive> {
    return new Promise<Comprehensive>((resolve, reject) => {
        if (/^\s*$/.test(token)) {
            reject(0)
        }
        axios.get(getComprehensiveUrl(token, position), {
            timeout: 5000
        })
            .then((response) => {
                resolve(response.data as Comprehensive)
            })
            .catch((e) => {
                if (e.response && typeof e.response.status == 'number') {
                    reject(e.response.status as number)
                } else {
                    reject(1)
                }
            });
    });
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