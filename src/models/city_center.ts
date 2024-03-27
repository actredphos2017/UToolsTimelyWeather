import axios from "axios";

export interface CityCenter {
    cityId: string;
    province: string;
    city: string;
    district: string;
    latitude: string;
    longitude: string;
}

let cityCenters = null as null | CityCenter[];

export const getCityCenters = async () => new Promise<CityCenter[]>((resolve, reject) => {
    if (cityCenters) resolve(cityCenters);
    axios.get(new URL(`../assets/city_centers.json`, import.meta.url).href)
        .then(response => {
            cityCenters = response.data as CityCenter[];
            resolve(cityCenters);
        })
        .catch(reject);
});