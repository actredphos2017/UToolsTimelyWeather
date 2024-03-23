import {RealtimeResult} from "./realtime.ts";
import {MinutelyResult} from "./minutely.ts";
import {HourlyResult} from "./hourly.ts";
import {DailyResult} from "./daily.ts";
import {AlertResult} from "./alert.ts";
import {defaultLongLatitude, LongLatitude, parseCaiyunLLFormat} from "../models.ts";
import axios from "axios"

const testJson = `
{
    "status": "ok",
    "api_version": "v2.6",
    "api_status": "alpha",
    "lang": "zh_CN",
    "unit": "metric",
    "tzshift": 28800,
    "timezone": "Asia/Shanghai",
    "server_time": 1711199406,
    "location": [
        39.976,
        116.3176
    ],
    "result": {
        "alert": {
            "status": "ok",
            "content": [
                {
                    "province": "北京市",
                    "status": "预警中",
                    "code": "0501",
                    "description": "海淀区气象台21日17时00分发布大风蓝色预警,预计，22日10时至18时海淀区有3、4级偏北风，阵风6、7级，山区及浅山区短时阵风可达8级，局地有扬沙，请注意防范。",
                    "regionId": "",
                    "county": "海淀区",
                    "pubtimestamp": 1711011600,
                    "latlon": [
                        39.959893,
                        116.2977
                    ],
                    "city": "北京城区",
                    "alertId": "11010841600000_20240321165947",
                    "title": "海淀区气象台发布大风蓝色预警[IV/一般]",
                    "adcode": "110108",
                    "source": "国家预警信息发布中心",
                    "location": "北京市海淀区",
                    "request_status": "ok"
                }
            ],
            "adcodes": [
                {
                    "adcode": 110000,
                    "name": "北京市"
                },
                {
                    "adcode": 110100,
                    "name": "北京城区"
                },
                {
                    "adcode": 110108,
                    "name": "海淀区"
                }
            ]
        },
        "realtime": {
            "status": "ok",
            "temperature": 16.98,
            "humidity": 0.35,
            "cloudrate": 1,
            "skycon": "LIGHT_HAZE",
            "visibility": 7.1,
            "dswrf": 0,
            "wind": {
                "speed": 6.95,
                "direction": 146.14
            },
            "pressure": 100639.84,
            "apparent_temperature": 15.1,
            "precipitation": {
                "local": {
                    "status": "ok",
                    "datasource": "radar",
                    "intensity": 0
                },
                "nearest": {
                    "status": "ok",
                    "distance": 92.72,
                    "intensity": 0.1875
                }
            },
            "air_quality": {
                "pm25": 93,
                "pm10": 164,
                "o3": 97,
                "so2": 10,
                "no2": 47,
                "co": 1,
                "aqi": {
                    "chn": 123,
                    "usa": 170
                },
                "description": {
                    "chn": "轻度污染",
                    "usa": "中度污染"
                }
            },
            "life_index": {
                "ultraviolet": {
                    "index": 0,
                    "desc": "无"
                },
                "comfort": {
                    "index": 6,
                    "desc": "凉爽"
                }
            }
        },
        "minutely": {
            "status": "ok",
            "datasource": "radar",
            "precipitation_2h": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            "precipitation": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            "probability": [
                0,
                0,
                0,
                0
            ],
            "description": "最近的降雨带在东边93公里外呢"
        },
        "hourly": {
            "status": "ok",
            "description": "阴，明天下午16点钟后转小雨，其后阴",
            "precipitation": [
                {
                    "datetime": "2024-03-23T21:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-23T22:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-23T23:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T00:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T01:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T02:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T03:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T04:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T05:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T06:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T07:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T08:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T09:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T10:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T11:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T12:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T13:00+08:00",
                    "value": 0,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T14:00+08:00",
                    "value": 0.0408,
                    "probability": 0
                },
                {
                    "datetime": "2024-03-24T15:00+08:00",
                    "value": 0.0729,
                    "probability": 60
                },
                {
                    "datetime": "2024-03-24T16:00+08:00",
                    "value": 0.0791,
                    "probability": 60
                },
                {
                    "datetime": "2024-03-24T17:00+08:00",
                    "value": 0.1131,
                    "probability": 60
                },
                {
                    "datetime": "2024-03-24T18:00+08:00",
                    "value": 0.0825,
                    "probability": 60
                },
                {
                    "datetime": "2024-03-24T19:00+08:00",
                    "value": 0.0836,
                    "probability": 60
                },
                {
                    "datetime": "2024-03-24T20:00+08:00",
                    "value": 0.0402,
                    "probability": 0
                }
            ],
            "temperature": [
                {
                    "datetime": "2024-03-23T21:00+08:00",
                    "value": 16.98
                },
                {
                    "datetime": "2024-03-23T22:00+08:00",
                    "value": 15.65
                },
                {
                    "datetime": "2024-03-23T23:00+08:00",
                    "value": 14.33
                },
                {
                    "datetime": "2024-03-24T00:00+08:00",
                    "value": 12.86
                },
                {
                    "datetime": "2024-03-24T01:00+08:00",
                    "value": 11.4
                },
                {
                    "datetime": "2024-03-24T02:00+08:00",
                    "value": 9.94
                },
                {
                    "datetime": "2024-03-24T03:00+08:00",
                    "value": 9.1
                },
                {
                    "datetime": "2024-03-24T04:00+08:00",
                    "value": 8.9
                },
                {
                    "datetime": "2024-03-24T05:00+08:00",
                    "value": 8.72
                },
                {
                    "datetime": "2024-03-24T06:00+08:00",
                    "value": 9.19
                },
                {
                    "datetime": "2024-03-24T07:00+08:00",
                    "value": 9.65
                },
                {
                    "datetime": "2024-03-24T08:00+08:00",
                    "value": 10.11
                },
                {
                    "datetime": "2024-03-24T09:00+08:00",
                    "value": 10.66
                },
                {
                    "datetime": "2024-03-24T10:00+08:00",
                    "value": 11.22
                },
                {
                    "datetime": "2024-03-24T11:00+08:00",
                    "value": 11.77
                },
                {
                    "datetime": "2024-03-24T12:00+08:00",
                    "value": 11.87
                },
                {
                    "datetime": "2024-03-24T13:00+08:00",
                    "value": 11.96
                },
                {
                    "datetime": "2024-03-24T14:00+08:00",
                    "value": 12.05
                },
                {
                    "datetime": "2024-03-24T15:00+08:00",
                    "value": 11.81
                },
                {
                    "datetime": "2024-03-24T16:00+08:00",
                    "value": 11.56
                },
                {
                    "datetime": "2024-03-24T17:00+08:00",
                    "value": 11.32
                },
                {
                    "datetime": "2024-03-24T18:00+08:00",
                    "value": 10.54
                },
                {
                    "datetime": "2024-03-24T19:00+08:00",
                    "value": 9.75
                },
                {
                    "datetime": "2024-03-24T20:00+08:00",
                    "value": 8.93
                }
            ],
            "apparent_temperature": [
                {
                    "datetime": "2024-03-23T21:00+08:00",
                    "value": 15.1
                },
                {
                    "datetime": "2024-03-23T22:00+08:00",
                    "value": 13.2
                },
                {
                    "datetime": "2024-03-23T23:00+08:00",
                    "value": 11.9
                },
                {
                    "datetime": "2024-03-24T00:00+08:00",
                    "value": 10.2
                },
                {
                    "datetime": "2024-03-24T01:00+08:00",
                    "value": 8.8
                },
                {
                    "datetime": "2024-03-24T02:00+08:00",
                    "value": 7.2
                },
                {
                    "datetime": "2024-03-24T03:00+08:00",
                    "value": 6.5
                },
                {
                    "datetime": "2024-03-24T04:00+08:00",
                    "value": 6.2
                },
                {
                    "datetime": "2024-03-24T05:00+08:00",
                    "value": 6.1
                },
                {
                    "datetime": "2024-03-24T06:00+08:00",
                    "value": 6.7
                },
                {
                    "datetime": "2024-03-24T07:00+08:00",
                    "value": 7.5
                },
                {
                    "datetime": "2024-03-24T08:00+08:00",
                    "value": 7.6
                },
                {
                    "datetime": "2024-03-24T09:00+08:00",
                    "value": 7.6
                },
                {
                    "datetime": "2024-03-24T10:00+08:00",
                    "value": 8
                },
                {
                    "datetime": "2024-03-24T11:00+08:00",
                    "value": 8.5
                },
                {
                    "datetime": "2024-03-24T12:00+08:00",
                    "value": 8.7
                },
                {
                    "datetime": "2024-03-24T13:00+08:00",
                    "value": 9.2
                },
                {
                    "datetime": "2024-03-24T14:00+08:00",
                    "value": 9.6
                },
                {
                    "datetime": "2024-03-24T15:00+08:00",
                    "value": 9.6
                },
                {
                    "datetime": "2024-03-24T16:00+08:00",
                    "value": 9.7
                },
                {
                    "datetime": "2024-03-24T17:00+08:00",
                    "value": 9.8
                },
                {
                    "datetime": "2024-03-24T18:00+08:00",
                    "value": 8.9
                },
                {
                    "datetime": "2024-03-24T19:00+08:00",
                    "value": 7.7
                },
                {
                    "datetime": "2024-03-24T20:00+08:00",
                    "value": 6.8
                }
            ],
            "wind": [
                {
                    "datetime": "2024-03-23T21:00+08:00",
                    "speed": 6.95,
                    "direction": 146.14
                },
                {
                    "datetime": "2024-03-23T22:00+08:00",
                    "speed": 6.94,
                    "direction": 138.93
                },
                {
                    "datetime": "2024-03-23T23:00+08:00",
                    "speed": 6.52,
                    "direction": 132.27
                },
                {
                    "datetime": "2024-03-24T00:00+08:00",
                    "speed": 7.15,
                    "direction": 111.12
                },
                {
                    "datetime": "2024-03-24T01:00+08:00",
                    "speed": 6.67,
                    "direction": 102.75
                },
                {
                    "datetime": "2024-03-24T02:00+08:00",
                    "speed": 6.86,
                    "direction": 114.12
                },
                {
                    "datetime": "2024-03-24T03:00+08:00",
                    "speed": 5.44,
                    "direction": 92.39
                },
                {
                    "datetime": "2024-03-24T04:00+08:00",
                    "speed": 6.21,
                    "direction": 79.34
                },
                {
                    "datetime": "2024-03-24T05:00+08:00",
                    "speed": 5.99,
                    "direction": 74.85
                },
                {
                    "datetime": "2024-03-24T06:00+08:00",
                    "speed": 5.36,
                    "direction": 71.67
                },
                {
                    "datetime": "2024-03-24T07:00+08:00",
                    "speed": 3.85,
                    "direction": 100.9
                },
                {
                    "datetime": "2024-03-24T08:00+08:00",
                    "speed": 6.2,
                    "direction": 139.83
                },
                {
                    "datetime": "2024-03-24T09:00+08:00",
                    "speed": 9.45,
                    "direction": 144.06
                },
                {
                    "datetime": "2024-03-24T10:00+08:00",
                    "speed": 10.13,
                    "direction": 159.59
                },
                {
                    "datetime": "2024-03-24T11:00+08:00",
                    "speed": 10.88,
                    "direction": 163.89
                },
                {
                    "datetime": "2024-03-24T12:00+08:00",
                    "speed": 10.47,
                    "direction": 172.45
                },
                {
                    "datetime": "2024-03-24T13:00+08:00",
                    "speed": 8.27,
                    "direction": 176.46
                },
                {
                    "datetime": "2024-03-24T14:00+08:00",
                    "speed": 7.73,
                    "direction": 182.08
                },
                {
                    "datetime": "2024-03-24T15:00+08:00",
                    "speed": 7.26,
                    "direction": 184.95
                },
                {
                    "datetime": "2024-03-24T16:00+08:00",
                    "speed": 5.51,
                    "direction": 175.58
                },
                {
                    "datetime": "2024-03-24T17:00+08:00",
                    "speed": 4.05,
                    "direction": 151.77
                },
                {
                    "datetime": "2024-03-24T18:00+08:00",
                    "speed": 5,
                    "direction": 139.03
                },
                {
                    "datetime": "2024-03-24T19:00+08:00",
                    "speed": 6.45,
                    "direction": 151.13
                },
                {
                    "datetime": "2024-03-24T20:00+08:00",
                    "speed": 6.81,
                    "direction": 172.86
                }
            ],
            "humidity": [
                {
                    "datetime": "2024-03-23T21:00+08:00",
                    "value": 0.35
                },
                {
                    "datetime": "2024-03-23T22:00+08:00",
                    "value": 0.25
                },
                {
                    "datetime": "2024-03-23T23:00+08:00",
                    "value": 0.26
                },
                {
                    "datetime": "2024-03-24T00:00+08:00",
                    "value": 0.28
                },
                {
                    "datetime": "2024-03-24T01:00+08:00",
                    "value": 0.3
                },
                {
                    "datetime": "2024-03-24T02:00+08:00",
                    "value": 0.31
                },
                {
                    "datetime": "2024-03-24T03:00+08:00",
                    "value": 0.33
                },
                {
                    "datetime": "2024-03-24T04:00+08:00",
                    "value": 0.34
                },
                {
                    "datetime": "2024-03-24T05:00+08:00",
                    "value": 0.35
                },
                {
                    "datetime": "2024-03-24T06:00+08:00",
                    "value": 0.36
                },
                {
                    "datetime": "2024-03-24T07:00+08:00",
                    "value": 0.36
                },
                {
                    "datetime": "2024-03-24T08:00+08:00",
                    "value": 0.35
                },
                {
                    "datetime": "2024-03-24T09:00+08:00",
                    "value": 0.36
                },
                {
                    "datetime": "2024-03-24T10:00+08:00",
                    "value": 0.34
                },
                {
                    "datetime": "2024-03-24T11:00+08:00",
                    "value": 0.32
                },
                {
                    "datetime": "2024-03-24T12:00+08:00",
                    "value": 0.33
                },
                {
                    "datetime": "2024-03-24T13:00+08:00",
                    "value": 0.35
                },
                {
                    "datetime": "2024-03-24T14:00+08:00",
                    "value": 0.4
                },
                {
                    "datetime": "2024-03-24T15:00+08:00",
                    "value": 0.47
                },
                {
                    "datetime": "2024-03-24T16:00+08:00",
                    "value": 0.52
                },
                {
                    "datetime": "2024-03-24T17:00+08:00",
                    "value": 0.55
                },
                {
                    "datetime": "2024-03-24T18:00+08:00",
                    "value": 0.59
                },
                {
                    "datetime": "2024-03-24T19:00+08:00",
                    "value": 0.61
                },
                {
                    "datetime": "2024-03-24T20:00+08:00",
                    "value": 0.63
                }
            ],
            "cloudrate": [
                {
                    "datetime": "2024-03-23T21:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-23T22:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-23T23:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T00:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T01:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T02:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T03:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T04:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T05:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T06:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T07:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T08:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T09:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T10:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T11:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T12:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T13:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T14:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T15:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T16:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T17:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T18:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T19:00+08:00",
                    "value": 1
                },
                {
                    "datetime": "2024-03-24T20:00+08:00",
                    "value": 1
                }
            ],
            "skycon": [
                {
                    "datetime": "2024-03-23T21:00+08:00",
                    "value": "LIGHT_HAZE"
                },
                {
                    "datetime": "2024-03-23T22:00+08:00",
                    "value": "LIGHT_HAZE"
                },
                {
                    "datetime": "2024-03-23T23:00+08:00",
                    "value": "LIGHT_HAZE"
                },
                {
                    "datetime": "2024-03-24T00:00+08:00",
                    "value": "FOG"
                },
                {
                    "datetime": "2024-03-24T01:00+08:00",
                    "value": "FOG"
                },
                {
                    "datetime": "2024-03-24T02:00+08:00",
                    "value": "FOG"
                },
                {
                    "datetime": "2024-03-24T03:00+08:00",
                    "value": "FOG"
                },
                {
                    "datetime": "2024-03-24T04:00+08:00",
                    "value": "FOG"
                },
                {
                    "datetime": "2024-03-24T05:00+08:00",
                    "value": "FOG"
                },
                {
                    "datetime": "2024-03-24T06:00+08:00",
                    "value": "FOG"
                },
                {
                    "datetime": "2024-03-24T07:00+08:00",
                    "value": "FOG"
                },
                {
                    "datetime": "2024-03-24T08:00+08:00",
                    "value": "FOG"
                },
                {
                    "datetime": "2024-03-24T09:00+08:00",
                    "value": "FOG"
                },
                {
                    "datetime": "2024-03-24T10:00+08:00",
                    "value": "FOG"
                },
                {
                    "datetime": "2024-03-24T11:00+08:00",
                    "value": "LIGHT_HAZE"
                },
                {
                    "datetime": "2024-03-24T12:00+08:00",
                    "value": "FOG"
                },
                {
                    "datetime": "2024-03-24T13:00+08:00",
                    "value": "FOG"
                },
                {
                    "datetime": "2024-03-24T14:00+08:00",
                    "value": "FOG"
                },
                {
                    "datetime": "2024-03-24T15:00+08:00",
                    "value": "LIGHT_RAIN"
                },
                {
                    "datetime": "2024-03-24T16:00+08:00",
                    "value": "LIGHT_RAIN"
                },
                {
                    "datetime": "2024-03-24T17:00+08:00",
                    "value": "LIGHT_RAIN"
                },
                {
                    "datetime": "2024-03-24T18:00+08:00",
                    "value": "LIGHT_RAIN"
                },
                {
                    "datetime": "2024-03-24T19:00+08:00",
                    "value": "LIGHT_RAIN"
                },
                {
                    "datetime": "2024-03-24T20:00+08:00",
                    "value": "FOG"
                }
            ],
            "pressure": [
                {
                    "datetime": "2024-03-23T21:00+08:00",
                    "value": 100639.835
                },
                {
                    "datetime": "2024-03-23T22:00+08:00",
                    "value": 100696.789
                },
                {
                    "datetime": "2024-03-23T23:00+08:00",
                    "value": 100779.062
                },
                {
                    "datetime": "2024-03-24T00:00+08:00",
                    "value": 100805.326
                },
                {
                    "datetime": "2024-03-24T01:00+08:00",
                    "value": 100848.156
                },
                {
                    "datetime": "2024-03-24T02:00+08:00",
                    "value": 100859.94
                },
                {
                    "datetime": "2024-03-24T03:00+08:00",
                    "value": 100911.5
                },
                {
                    "datetime": "2024-03-24T04:00+08:00",
                    "value": 100962.78
                },
                {
                    "datetime": "2024-03-24T05:00+08:00",
                    "value": 101038.249
                },
                {
                    "datetime": "2024-03-24T06:00+08:00",
                    "value": 101125.945
                },
                {
                    "datetime": "2024-03-24T07:00+08:00",
                    "value": 101199.047
                },
                {
                    "datetime": "2024-03-24T08:00+08:00",
                    "value": 101263.97
                },
                {
                    "datetime": "2024-03-24T09:00+08:00",
                    "value": 101293.739
                },
                {
                    "datetime": "2024-03-24T10:00+08:00",
                    "value": 101356.441
                },
                {
                    "datetime": "2024-03-24T11:00+08:00",
                    "value": 101365.887
                },
                {
                    "datetime": "2024-03-24T12:00+08:00",
                    "value": 101352.82
                },
                {
                    "datetime": "2024-03-24T13:00+08:00",
                    "value": 101343.179
                },
                {
                    "datetime": "2024-03-24T14:00+08:00",
                    "value": 101285.714
                },
                {
                    "datetime": "2024-03-24T15:00+08:00",
                    "value": 101264.784
                },
                {
                    "datetime": "2024-03-24T16:00+08:00",
                    "value": 101267.387
                },
                {
                    "datetime": "2024-03-24T17:00+08:00",
                    "value": 101285.518
                },
                {
                    "datetime": "2024-03-24T18:00+08:00",
                    "value": 101314.821
                },
                {
                    "datetime": "2024-03-24T19:00+08:00",
                    "value": 101316.462
                },
                {
                    "datetime": "2024-03-24T20:00+08:00",
                    "value": 101343.645
                }
            ],
            "visibility": [
                {
                    "datetime": "2024-03-23T21:00+08:00",
                    "value": 7.1
                },
                {
                    "datetime": "2024-03-23T22:00+08:00",
                    "value": 8.95
                },
                {
                    "datetime": "2024-03-23T23:00+08:00",
                    "value": 8.77
                },
                {
                    "datetime": "2024-03-24T00:00+08:00",
                    "value": 8.95
                },
                {
                    "datetime": "2024-03-24T01:00+08:00",
                    "value": 9.13
                },
                {
                    "datetime": "2024-03-24T02:00+08:00",
                    "value": 9.32
                },
                {
                    "datetime": "2024-03-24T03:00+08:00",
                    "value": 9.52
                },
                {
                    "datetime": "2024-03-24T04:00+08:00",
                    "value": 9.72
                },
                {
                    "datetime": "2024-03-24T05:00+08:00",
                    "value": 9.94
                },
                {
                    "datetime": "2024-03-24T06:00+08:00",
                    "value": 9.72
                },
                {
                    "datetime": "2024-03-24T07:00+08:00",
                    "value": 9.52
                },
                {
                    "datetime": "2024-03-24T08:00+08:00",
                    "value": 9.13
                },
                {
                    "datetime": "2024-03-24T09:00+08:00",
                    "value": 9.32
                },
                {
                    "datetime": "2024-03-24T10:00+08:00",
                    "value": 9.52
                },
                {
                    "datetime": "2024-03-24T11:00+08:00",
                    "value": 9.72
                },
                {
                    "datetime": "2024-03-24T12:00+08:00",
                    "value": 10.4
                },
                {
                    "datetime": "2024-03-24T13:00+08:00",
                    "value": 11.18
                },
                {
                    "datetime": "2024-03-24T14:00+08:00",
                    "value": 11.77
                },
                {
                    "datetime": "2024-03-24T15:00+08:00",
                    "value": 11.77
                },
                {
                    "datetime": "2024-03-24T16:00+08:00",
                    "value": 11.47
                },
                {
                    "datetime": "2024-03-24T17:00+08:00",
                    "value": 11.18
                },
                {
                    "datetime": "2024-03-24T18:00+08:00",
                    "value": 11.47
                },
                {
                    "datetime": "2024-03-24T19:00+08:00",
                    "value": 11.77
                },
                {
                    "datetime": "2024-03-24T20:00+08:00",
                    "value": 12.09
                }
            ],
            "dswrf": [
                {
                    "datetime": "2024-03-23T21:00+08:00",
                    "value": 0
                },
                {
                    "datetime": "2024-03-23T22:00+08:00",
                    "value": 0
                },
                {
                    "datetime": "2024-03-23T23:00+08:00",
                    "value": 0
                },
                {
                    "datetime": "2024-03-24T00:00+08:00",
                    "value": 0
                },
                {
                    "datetime": "2024-03-24T01:00+08:00",
                    "value": 0
                },
                {
                    "datetime": "2024-03-24T02:00+08:00",
                    "value": 0
                },
                {
                    "datetime": "2024-03-24T03:00+08:00",
                    "value": 0
                },
                {
                    "datetime": "2024-03-24T04:00+08:00",
                    "value": 0
                },
                {
                    "datetime": "2024-03-24T05:00+08:00",
                    "value": 0
                },
                {
                    "datetime": "2024-03-24T06:00+08:00",
                    "value": 0
                },
                {
                    "datetime": "2024-03-24T07:00+08:00",
                    "value": 14.46
                },
                {
                    "datetime": "2024-03-24T08:00+08:00",
                    "value": 178.993
                },
                {
                    "datetime": "2024-03-24T09:00+08:00",
                    "value": 243.671
                },
                {
                    "datetime": "2024-03-24T10:00+08:00",
                    "value": 252.573
                },
                {
                    "datetime": "2024-03-24T11:00+08:00",
                    "value": 263.15
                },
                {
                    "datetime": "2024-03-24T12:00+08:00",
                    "value": 254.681
                },
                {
                    "datetime": "2024-03-24T13:00+08:00",
                    "value": 247.468
                },
                {
                    "datetime": "2024-03-24T14:00+08:00",
                    "value": 179.742
                },
                {
                    "datetime": "2024-03-24T15:00+08:00",
                    "value": 147.118
                },
                {
                    "datetime": "2024-03-24T16:00+08:00",
                    "value": 117.261
                },
                {
                    "datetime": "2024-03-24T17:00+08:00",
                    "value": 92.525
                },
                {
                    "datetime": "2024-03-24T18:00+08:00",
                    "value": 74.473
                },
                {
                    "datetime": "2024-03-24T19:00+08:00",
                    "value": 62.005
                },
                {
                    "datetime": "2024-03-24T20:00+08:00",
                    "value": 0
                }
            ],
            "air_quality": {
                "aqi": [
                    {
                        "datetime": "2024-03-23T21:00+08:00",
                        "value": {
                            "chn": 123,
                            "usa": 170
                        }
                    },
                    {
                        "datetime": "2024-03-23T22:00+08:00",
                        "value": {
                            "chn": 124,
                            "usa": 163
                        }
                    },
                    {
                        "datetime": "2024-03-23T23:00+08:00",
                        "value": {
                            "chn": 108,
                            "usa": 164
                        }
                    },
                    {
                        "datetime": "2024-03-24T00:00+08:00",
                        "value": {
                            "chn": 112,
                            "usa": 163
                        }
                    },
                    {
                        "datetime": "2024-03-24T01:00+08:00",
                        "value": {
                            "chn": 117,
                            "usa": 163
                        }
                    },
                    {
                        "datetime": "2024-03-24T02:00+08:00",
                        "value": {
                            "chn": 122,
                            "usa": 162
                        }
                    },
                    {
                        "datetime": "2024-03-24T03:00+08:00",
                        "value": {
                            "chn": 124,
                            "usa": 162
                        }
                    },
                    {
                        "datetime": "2024-03-24T04:00+08:00",
                        "value": {
                            "chn": 126,
                            "usa": 161
                        }
                    },
                    {
                        "datetime": "2024-03-24T05:00+08:00",
                        "value": {
                            "chn": 107,
                            "usa": 161
                        }
                    },
                    {
                        "datetime": "2024-03-24T06:00+08:00",
                        "value": {
                            "chn": 110,
                            "usa": 161
                        }
                    },
                    {
                        "datetime": "2024-03-24T07:00+08:00",
                        "value": {
                            "chn": 114,
                            "usa": 162
                        }
                    },
                    {
                        "datetime": "2024-03-24T08:00+08:00",
                        "value": {
                            "chn": 117,
                            "usa": 163
                        }
                    },
                    {
                        "datetime": "2024-03-24T09:00+08:00",
                        "value": {
                            "chn": 118,
                            "usa": 162
                        }
                    },
                    {
                        "datetime": "2024-03-24T10:00+08:00",
                        "value": {
                            "chn": 117,
                            "usa": 162
                        }
                    },
                    {
                        "datetime": "2024-03-24T11:00+08:00",
                        "value": {
                            "chn": 116,
                            "usa": 161
                        }
                    },
                    {
                        "datetime": "2024-03-24T12:00+08:00",
                        "value": {
                            "chn": 117,
                            "usa": 160
                        }
                    },
                    {
                        "datetime": "2024-03-24T13:00+08:00",
                        "value": {
                            "chn": 116,
                            "usa": 158
                        }
                    },
                    {
                        "datetime": "2024-03-24T14:00+08:00",
                        "value": {
                            "chn": 114,
                            "usa": 157
                        }
                    },
                    {
                        "datetime": "2024-03-24T15:00+08:00",
                        "value": {
                            "chn": 117,
                            "usa": 157
                        }
                    },
                    {
                        "datetime": "2024-03-24T16:00+08:00",
                        "value": {
                            "chn": 119,
                            "usa": 157
                        }
                    },
                    {
                        "datetime": "2024-03-24T17:00+08:00",
                        "value": {
                            "chn": 119,
                            "usa": 158
                        }
                    },
                    {
                        "datetime": "2024-03-24T18:00+08:00",
                        "value": {
                            "chn": 119,
                            "usa": 157
                        }
                    },
                    {
                        "datetime": "2024-03-24T19:00+08:00",
                        "value": {
                            "chn": 121,
                            "usa": 157
                        }
                    },
                    {
                        "datetime": "2024-03-24T20:00+08:00",
                        "value": {
                            "chn": 117,
                            "usa": 156
                        }
                    }
                ],
                "pm25": [
                    {
                        "datetime": "2024-03-23T21:00+08:00",
                        "value": 93
                    },
                    {
                        "datetime": "2024-03-23T22:00+08:00",
                        "value": 80
                    },
                    {
                        "datetime": "2024-03-23T23:00+08:00",
                        "value": 81
                    },
                    {
                        "datetime": "2024-03-24T00:00+08:00",
                        "value": 80
                    },
                    {
                        "datetime": "2024-03-24T01:00+08:00",
                        "value": 79
                    },
                    {
                        "datetime": "2024-03-24T02:00+08:00",
                        "value": 78
                    },
                    {
                        "datetime": "2024-03-24T03:00+08:00",
                        "value": 77
                    },
                    {
                        "datetime": "2024-03-24T04:00+08:00",
                        "value": 76
                    },
                    {
                        "datetime": "2024-03-24T05:00+08:00",
                        "value": 75
                    },
                    {
                        "datetime": "2024-03-24T06:00+08:00",
                        "value": 76
                    },
                    {
                        "datetime": "2024-03-24T07:00+08:00",
                        "value": 77
                    },
                    {
                        "datetime": "2024-03-24T08:00+08:00",
                        "value": 79
                    },
                    {
                        "datetime": "2024-03-24T09:00+08:00",
                        "value": 78
                    },
                    {
                        "datetime": "2024-03-24T10:00+08:00",
                        "value": 77
                    },
                    {
                        "datetime": "2024-03-24T11:00+08:00",
                        "value": 76
                    },
                    {
                        "datetime": "2024-03-24T12:00+08:00",
                        "value": 73
                    },
                    {
                        "datetime": "2024-03-24T13:00+08:00",
                        "value": 70
                    },
                    {
                        "datetime": "2024-03-24T14:00+08:00",
                        "value": 68
                    },
                    {
                        "datetime": "2024-03-24T15:00+08:00",
                        "value": 68
                    },
                    {
                        "datetime": "2024-03-24T16:00+08:00",
                        "value": 69
                    },
                    {
                        "datetime": "2024-03-24T17:00+08:00",
                        "value": 70
                    },
                    {
                        "datetime": "2024-03-24T18:00+08:00",
                        "value": 69
                    },
                    {
                        "datetime": "2024-03-24T19:00+08:00",
                        "value": 68
                    },
                    {
                        "datetime": "2024-03-24T20:00+08:00",
                        "value": 67
                    }
                ]
            }
        },
        "daily": {
            "status": "ok",
            "astro": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "sunrise": {
                        "time": "06:12"
                    },
                    "sunset": {
                        "time": "18:29"
                    }
                }
            ],
            "precipitation_08h_20h": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "max": 0,
                    "min": 0,
                    "avg": 0,
                    "probability": 0
                }
            ],
            "precipitation_20h_32h": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "max": 0,
                    "min": 0,
                    "avg": 0,
                    "probability": 0
                }
            ],
            "precipitation": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "max": 0,
                    "min": 0,
                    "avg": 0,
                    "probability": 0
                }
            ],
            "temperature": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "max": 20.32,
                    "min": 7.14,
                    "avg": 15.65
                }
            ],
            "temperature_08h_20h": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "max": 20.32,
                    "min": 7.86,
                    "avg": 16.46
                }
            ],
            "temperature_20h_32h": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "max": 19,
                    "min": 8.72,
                    "avg": 12.92
                }
            ],
            "wind": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "max": {
                        "speed": 9.87,
                        "direction": 225.96
                    },
                    "min": {
                        "speed": 1.62,
                        "direction": 54.76
                    },
                    "avg": {
                        "speed": 5.11,
                        "direction": 143.34
                    }
                }
            ],
            "wind_08h_20h": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "max": {
                        "speed": 9.87,
                        "direction": 225.96
                    },
                    "min": {
                        "speed": 4.22,
                        "direction": 67.39
                    },
                    "avg": {
                        "speed": 3.44,
                        "direction": 160.66
                    }
                }
            ],
            "wind_20h_32h": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "max": {
                        "speed": 7.15,
                        "direction": 111.12
                    },
                    "min": {
                        "speed": 2.69,
                        "direction": 134.73
                    },
                    "avg": {
                        "speed": 6.06,
                        "direction": 113.97
                    }
                }
            ],
            "humidity": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "max": 0.42,
                    "min": 0.14,
                    "avg": 0.29
                }
            ],
            "cloudrate": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "max": 1,
                    "min": 0.42,
                    "avg": 1
                }
            ],
            "pressure": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "max": 100779.06,
                    "min": 100014.69,
                    "avg": 100705.23
                }
            ],
            "visibility": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "max": 24.14,
                    "min": 7.1,
                    "avg": 8.27
                }
            ],
            "dswrf": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "max": 595.7,
                    "min": 0,
                    "avg": 0
                }
            ],
            "air_quality": {
                "aqi": [
                    {
                        "date": "2024-03-23T00:00+08:00",
                        "max": {
                            "chn": 129,
                            "usa": 172
                        },
                        "avg": {
                            "chn": 118,
                            "usa": 166
                        },
                        "min": {
                            "chn": 37,
                            "usa": 34
                        }
                    }
                ],
                "pm25": [
                    {
                        "date": "2024-03-23T00:00+08:00",
                        "max": 98,
                        "avg": 84,
                        "min": 8
                    }
                ]
            },
            "skycon": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "value": "LIGHT_HAZE"
                }
            ],
            "skycon_08h_20h": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "value": "CLOUDY"
                }
            ],
            "skycon_20h_32h": [
                {
                    "date": "2024-03-23T00:00+08:00",
                    "value": "LIGHT_HAZE"
                }
            ],
            "life_index": {
                "ultraviolet": [
                    {
                        "date": "2024-03-23T00:00+08:00",
                        "index": "1",
                        "desc": "最弱"
                    }
                ],
                "carWashing": [
                    {
                        "date": "2024-03-23T00:00+08:00",
                        "index": "3",
                        "desc": "较不适宜"
                    }
                ],
                "dressing": [
                    {
                        "date": "2024-03-23T00:00+08:00",
                        "index": "4",
                        "desc": "温暖"
                    }
                ],
                "comfort": [
                    {
                        "date": "2024-03-23T00:00+08:00",
                        "index": "6",
                        "desc": "凉爽"
                    }
                ],
                "coldRisk": [
                    {
                        "date": "2024-03-23T00:00+08:00",
                        "index": "4",
                        "desc": "极易发"
                    }
                ]
            }
        },
        "primary": 0,
        "forecast_keypoint": "最近的降雨带在东边93公里外呢"
    }
}
`

export function getComprehensiveUrl(token: string, position: LongLatitude = defaultLongLatitude) {
    return `https://api.caiyunapp.com/v2.6/TAkhjf8d1nlSlspN/${parseCaiyunLLFormat(position)}/weather?alert=true&dailysteps=1&hourlysteps=24&token=${token}`
}

export async function getComprehensiveTestSuccess(token: string, position: LongLatitude = defaultLongLatitude) {
    return new Promise<Comprehensive>((resolve) => {
        const url = getComprehensiveUrl(token, position);
        console.log(url)

        setTimeout(() => {
            resolve(JSON.parse(testJson) as Comprehensive)
        }, 1000);
    })
}

export async function getComprehensiveTestFailed(token: string, position: LongLatitude = defaultLongLatitude) {
    return new Promise<Comprehensive>((_, reject) => {
        const url = getComprehensiveUrl(token, position);
        console.log(url)

        setTimeout(() => {
            reject(JSON.parse(testJson) as Comprehensive)
        }, 1000);
    })
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