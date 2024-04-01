import {defineStore} from "pinia";
import {
    CityCenter,
    SavableLocation,
    toSavableLocationFromCityCenter,
    toSignalStringFromSavableLocation
} from "../models/city_center.ts";
import {Comprehensive, getComprehensive} from "../models/caiyunapi/comprehensive.ts";
import {utoolsStorage} from "../utils/preload_receiver";
import {publicToken} from "../utils/public_token.ts";

export const useWeatherHistoryStore = defineStore({
    id: 'weatherHistory',
    state: () => ({
        history: {} as Record<string, Comprehensive>
    }),
    actions: {
        async updateHistory(loc: SavableLocation, force: boolean = false): Promise<Comprehensive> {
            const signalString = toSignalStringFromSavableLocation(loc);
            if (this.history[signalString] && (!force || useSettingStore().usePublicToken)) {
                if (new Date().getTime() / 1000 - this.history[signalString]!.server_time > (useSettingStore().usePublicToken ? 1800 : 600)) {
                    if (useSettingStore().usePublicToken && useSettingStore().getFrequent1h() >= 5) {
                        throw {
                            code: 2,
                            oldData: this.history[signalString]
                        }
                    }
                    return new Promise((resolve, reject) => {
                        getComprehensive(useSettingStore().getToken, loc).then(com => {
                            this.history[signalString] = com;
                            useSettingStore().record();
                            resolve(com);
                        }).catch((status: number) => {
                            reject({
                                code: status,
                                oldData: this.history[signalString]
                            });
                        });
                    });
                } else {
                    return this.history[signalString];
                }
            } else {
                return new Promise((resolve, reject) => {
                    getComprehensive(useSettingStore().getToken, loc).then(com => {
                        this.history[signalString] = com;
                        useSettingStore().record();
                        resolve(com);
                    }).catch((status: number) => {
                        reject({
                            code: status,
                            oldData: undefined
                        });
                    });
                });
            }
        },
    },
    persist: {
        storage: utoolsStorage
    }
});

export const useSettingStore = defineStore({
    id: 'settings',
    state: () => ({
        caiyunToken: '',
        usePublicToken: false,
        frequent: [] as number[]
    }),
    actions: {
        updateCaiyunToken(token: string) {
            this.caiyunToken = token;
        },
        record() {
            this.frequent.push(new Date().getTime());
        },
        getFrequent1h() {
            const oneHourBefore = new Date();
            oneHourBefore.setHours(oneHourBefore.getHours() - 1);
            this.frequent = this.frequent.filter(e => e > oneHourBefore.getTime());
            return this.frequent.length;
        }
    },
    getters: {
        getToken(): string {
            return this.usePublicToken ? publicToken : this.caiyunToken;
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
        favoriteIndex: 0
    }),
    actions: {
        pushCityCenter(cityCenter: CityCenter) {
            this.userLocations.push(toSavableLocationFromCityCenter(cityCenter))
        },
        pushSavableLocation(loc: SavableLocation) {
            this.userLocations.push(loc);
        },
        removeLocationAtIndex(index: number) {
            if (this.favoriteIndex == index) {
                this.favoriteIndex = 0;
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
