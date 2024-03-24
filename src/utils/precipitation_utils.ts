import {MinutelyData} from "../models/caiyunapi/minutely.ts";


export type PrecipitationStrengthEntry = {
    fromPrecipitation: number,
    toPrecipitation: number,
    level: {
        color: string,
        description: string
    }
}

const precipitationStrengthStep: PrecipitationStrengthEntry[] = [
    {
        fromPrecipitation: 0,
        toPrecipitation: 0.0606,
        level: {
            color: 'rgba(0,51,255,0)',
            description: '无'
        }
    },
    {
        fromPrecipitation: 0.0606,
        toPrecipitation: 0.8989,
        level: {
            color: 'rgba(0,51,255,0.2)',
            description: '小'
        }
    },
    {
        fromPrecipitation: 0.8989,
        toPrecipitation: 2.8700,
        level: {
            color: 'rgba(0,51,255,0.4)',
            description: '中'
        }
    },
    {
        fromPrecipitation: 2.8700,
        toPrecipitation: 12.8638,
        level: {
            color: 'rgba(0,51,255,0.6)',
            description: '大'
        }
    },
    {
        fromPrecipitation: 12.8638,
        toPrecipitation: 9999,
        level: {
            color: 'rgba(0,51,255,0.8)',
            description: '暴'
        }
    },
]

export type PrecipitationStrengthRectangle = {
    color: string,
    description: string,
    fromY: number,
    toY: number,
}

export function getPrecipitationStrengthRectangles(maxPrecipitation: number, maxHeight: number = 1000): PrecipitationStrengthRectangle[] {
    const precipitationStrengthEntries: PrecipitationStrengthEntry[] = [];
    for (const precipitationStrengthEntry of precipitationStrengthStep) {
        if (precipitationStrengthEntry.fromPrecipitation < maxPrecipitation)
            precipitationStrengthEntries.push(precipitationStrengthEntry);
        else break;
    }
    return precipitationStrengthEntries.map(item => {
        return {
            color: item.level.color,
            description: item.level.description,
            fromY: maxHeight * (item.fromPrecipitation / maxPrecipitation),
            toY: maxHeight * (item.toPrecipitation / maxPrecipitation)
        } as PrecipitationStrengthRectangle
    });
}


export function precipitationActive(minutelyData: MinutelyData): boolean {
    return Math.max(...minutelyData.precipitation_2h) > 0;
}
