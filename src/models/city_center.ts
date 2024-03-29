import axios from "axios";

export interface CityCenter {
    cityId: string;
    province: string;
    city: string;
    district: string;
    latitude: string;
    longitude: string;
}

export interface SavableLocation {
    name: string;
    latitude: number;
    longitude: number;
}

export function toSignalStringFromSavableLocation(loc: SavableLocation) {
    return JSON.stringify({
        lo: loc.longitude,
        la: loc.latitude
    });
}

export function toSavableLocationFromSignalString(str: string) {
    return JSON.parse(str) as SavableLocation;
}

export function toSavableLocationFromCityCenter(cityCenter: CityCenter) {
    return {
        name: `${cityCenter.province} ${cityCenter.city} ${cityCenter.district}`,
        latitude: parseFloat(cityCenter.latitude),
        longitude: parseFloat(cityCenter.longitude),
    } as SavableLocation
}

let cityCenters = null as null | CityCenter[];

export const getCityCenters = async () => new Promise<CityCenter[]>((resolve, reject) => {
    if (cityCenters) resolve(cityCenters);
    axios.get(new URL(`../assets/city_centers.json`, import.meta.url).href)
        .then(response => {
            cityCenters = response.data as CityCenter[];
            console.log(cityCenters)
            resolve(cityCenters);
        })
        .catch(reject);
});

export async function searchCitiesByName(key: string) {
    console.log(key)
    const isBlack = /^\s*$/;
    if (isBlack.test(key)) {
        return [] as CityCenter[];
    }
    const cc = await getCityCenters();
    const res = [] as CityCenter[];
    for (let item of cc) {
        if (
            item.province.includes(key) ||
            item.city.includes(key) ||
            item.district.includes(key) ||
            item.cityId.includes(key)
        ) res.push(item);
    }
    return res;
}