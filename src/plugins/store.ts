import {defineStore} from "pinia";
import {
    CityCenter,
    SavableLocation,
    toSavableLocationFromCityCenter,
    toSignalStringFromSavableLocation
} from "../models/city_center.ts";
import {Comprehensive, ComprehensiveErrorData, getComprehensive} from "../models/caiyunapi/comprehensive.ts";

export const useWeatherHistoryStore = defineStore({
    id: 'weatherHistory',
    state: () => ({
        history: new Map<string, Comprehensive>()
    }),
    actions: {
        async updateHistory(loc: SavableLocation, force: boolean = false): Promise<Comprehensive> {
            const signalString = toSignalStringFromSavableLocation(loc);
            if (this.history.get(signalString) && !force) {
                const offset = new Date().getTime() / 1000 - this.history.get(signalString)!.server_time;
                if (offset > 600) {
                    return new Promise((resolve, reject) => {
                        getComprehensive(useSettingStore().caiyunToken, loc)
                            .then(resolve)
                            .catch((r: any) => {
                                if (r && r.data) {
                                    reject(r.data as ComprehensiveErrorData);
                                } else reject(undefined);
                            });
                    });
                } else {
                    return this.history.get(signalString)!;
                }
            } else {
                return new Promise((resolve, reject) => {
                    getComprehensive(useSettingStore().caiyunToken, loc)
                        .then(resolve)
                        .catch((r: any) => {
                            if (r && r.data) {
                                reject(r.data as ComprehensiveErrorData);
                            } else reject(undefined);
                        });
                });
            }
        }
    },
    persist: true,
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
    persist: true
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
    persist: true
});
