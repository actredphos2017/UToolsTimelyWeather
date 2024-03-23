export interface LongLatitude {
    longitude: number,
    latitude: number
}

export const defaultLongLatitude: LongLatitude = {
    longitude: 116.3176,
    latitude: 39.9760
}

export function parseCaiyunLLFormat(ll: LongLatitude) {
    return `${ll.longitude},${ll.latitude}`
}