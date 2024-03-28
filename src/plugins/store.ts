import {defineStore} from "pinia";
import {
    CityCenter,
    SavableLocation,
    toSavableLocationFromCityCenter,
    toSignalStringFromSavableLocation
} from "../models/city_center.ts";
import {Comprehensive, getComprehensive} from "../models/caiyunapi/comprehensive.ts";
import {utoolsStorage} from "../utils/preload_receiver";

export const useWeatherHistoryStore = defineStore({
    id: 'weatherHistory',
    state: () => ({
        history: {} as Record<string, Comprehensive>
    }),
    actions: {
        async updateHistory(loc: SavableLocation, force: boolean = false): Promise<Comprehensive> {
            const signalString = toSignalStringFromSavableLocation(loc);
            return (this.history[signalString] && !force) ? (
                (new Date().getTime() / 1000 - this.history[signalString]!.server_time > 600) ?
                    new Promise((resolve, reject) => {
                        getComprehensive(useSettingStore().caiyunToken, loc).then(com => {
                            this.history[signalString] = com;
                            resolve(com);
                        }).catch((status: number) => {
                            reject(status);
                        });
                    }) : this.history[signalString]
            ) : new Promise((resolve, reject) => {
                getComprehensive(useSettingStore().caiyunToken, loc).then(com => {
                    this.history[signalString] = com;
                    resolve(com);
                }).catch((status: number) => {
                    reject(status);
                });
            });
        },
    },
    persist: {
        storage: utoolsStorage
    }
});

export const useSettingStore = defineStore({
    id: 'settings',
    state: () => ({
        caiyunToken: ''
    }),
    actions: {
        updateCaiyunToken(token: string) {
            this.caiyunToken = token;
        }
    },
    persist: {
        storage: utoolsStorage
    }
});

export const useLocationListStore = defineStore({
    id: 'locationList',
    state: () => ({
        userLocations: [] as SavableLocation[],
        favoriteIndex: null as number | null
    }),
    actions: {
        pushCityCenter(cityCenter: CityCenter) {
            this.userLocations.push(toSavableLocationFromCityCenter(cityCenter))
        },
        removeLocationAtIndex(index: number) {
            if (this.favoriteIndex == index) {
                this.favoriteIndex = null;
            }
            this.userLocations.splice(index, 1);
        },
        setFavoriteIndex(index: number) {
            if (index >= 0 && index < this.userLocations.length)
                this.favoriteIndex = index;
        }
    },
    persist: {
        storage: utoolsStorage
    }
});
