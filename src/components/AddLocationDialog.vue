<script setup lang="ts">

import {Edit, Location, QuestionFilled, Search, Warning, WarningFilled} from "@element-plus/icons-vue";
import {computed, onMounted, reactive, ref} from "vue";
import {CityCenter, SavableLocation, searchCitiesByName} from "../models/city_center.ts";
import {ElMessage} from "element-plus";
import {useLocationListStore, useSettingStore, useWeatherHistoryStore} from "../plugins/store.ts";
import {LongLatitude} from "../models/models.ts";
import {cpy} from "../utils";

const displayAddCityDialog = defineModel({
  default: false
});

const citySearchKey = ref('');

const searching = ref(false);
const searchResult = ref<undefined | CityCenter[]>();

const locatingCountdown = ref(0);
let interval: NodeJS.Timeout | undefined = undefined;

function setCountdown(countdown: number) {
  locatingCountdown.value = countdown;
  interval = setInterval(() => {
    locatingCountdown.value--;
    if (locatingCountdown.value <= 0) {
      clearInterval(interval);
    }
  }, 1000);
}

function stopCountdown() {
  clearInterval(interval);
  locatingCountdown.value = 0;
}

const locateResult = ref<LongLatitude | null>(null);
const gettingLocateCityInfo = ref(false);
const locateNeedManualInputCityName = ref(false);
const locateCityName = ref('');

const geoLocationSubmittable = computed(() => (
    !!locateResult.value &&
    !/^\s*$/.test(locateCityName.value)
));

function submitGeoLocation() {
  if (geoLocationSubmittable.value) {
    addSavableLocation({
      latitude: locateResult.value!.latitude,
      longitude: locateResult.value!.longitude,
      name: locateCityName.value,
    })
  }
}

function getGeoLocation() {
  setCountdown(10);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      if (position.coords.longitude && position.coords.latitude) {
        locateResult.value = {
          latitude: Math.round(position.coords.latitude * 10000) / 10000,
          longitude: Math.round(position.coords.longitude * 10000) / 10000,
        };
        getCityInfo();
      }
      stopCountdown();
    }, () => {
      stopCountdown();
    }, {
      timeout: 10000
    });
  }
}


function getCityInfo() {
  if (locateResult.value) {
    if (/^\s*$/.test(useSettingStore().caiyunToken)) {
      ElMessage.error('彩云 TOKEN 不可用，无法获取城市名，请手动输入');
      locateNeedManualInputCityName.value = true;
    } else {
      gettingLocateCityInfo.value = true;
      useWeatherHistoryStore().updateHistory({
        latitude: locateResult.value.latitude,
        longitude: locateResult.value.longitude,
        name: 'undefined'
      })
          .then(res => new Promise<void>((resolve, reject) => {
            if (res.result.alert) {
              locateCityName.value = res.result.alert.adcodes.map(e => e.name).join(' ');
              resolve();
            } else {
              reject();
            }
          }))
          .catch(() => {
            ElMessage.error('彩云 API 获取城市信息失败，请手动输入');
            locateNeedManualInputCityName.value = true;
          })
          .finally(() => {
            gettingLocateCityInfo.value = false;
          });
    }
  }
}

onMounted(() => {
  getGeoLocation();
});

function startSearch() {
  searching.value = true;
  searchCitiesByName(citySearchKey.value)
      .then(res => {
        console.log(res);
        searchResult.value = res;
      })
      .catch(e => {
        ElMessage.error(e);
      })
      .finally(() => {
        searching.value = false;
      });
}

const locationState = useLocationListStore();

const inputLocationForm = reactive({
  latitude: '',
  longitude: '',
  name: ''
});

const latitudeInput = ref();

const handleLongitudeChange = () => {
  const parts = inputLocationForm.longitude.split(",").map(e => e.trim());
  if (parts.length != 2 || parts.some(e => e.length == 0)) return;
  const nums = parts.map(Number);
  if (nums.some(e => isNaN(e) || !isFinite(e))) return;
  inputLocationForm.longitude = parts[0];
  inputLocationForm.latitude = parts[1];
  latitudeInput.value?.focus();
}

const gettingInputCityInfo = ref(false);
const getInputCityInfoAvailable = computed(() => (
    !isNaN(parseFloat(inputLocationForm.latitude)) &&
    !isNaN(parseFloat(inputLocationForm.longitude)) &&
    !/^\s*$/.test(useSettingStore().caiyunToken)
));

const inputCitySubmittable = computed(() => (
    !isNaN(parseFloat(inputLocationForm.latitude)) &&
    !isNaN(parseFloat(inputLocationForm.longitude)) &&
    !/^\s*$/.test(inputLocationForm.name)
));

function submitInputCity() {
  addSavableLocation({
    latitude: parseFloat(inputLocationForm.latitude),
    longitude: parseFloat(inputLocationForm.longitude),
    name: inputLocationForm.name,
  });
}

function getInputCityInfo() {
  if (/^\s*$/.test(useSettingStore().caiyunToken)) {
    ElMessage.error('彩云 TOKEN 不可用，无法获取城市信息，请手动输入');
  } else {
    gettingInputCityInfo.value = true;
    useWeatherHistoryStore().updateHistory({
      latitude: parseFloat(inputLocationForm.latitude),
      longitude: parseFloat(inputLocationForm.longitude),
      name: 'undefined'
    })
        .then(res => new Promise<void>((resolve, reject) => {
          if (res.result.alert) {
            inputLocationForm.name = res.result.alert.adcodes.map(e => e.name).join(' ');
            resolve();
          } else {
            reject();
          }
        }))
        .catch(() => {
          ElMessage.error('彩云 API 获取城市信息失败，请手动输入');
        })
        .finally(() => {
          gettingInputCityInfo.value = false;
        });
  }
}

function addCityCenter(city: CityCenter) {
  locationState.pushCityCenter(city);
  displayAddCityDialog.value = false;
}

function addSavableLocation(loc: SavableLocation) {
  locationState.pushSavableLocation(loc);
  displayAddCityDialog.value = false;
}

</script>

<template>
  <el-dialog
      v-model="displayAddCityDialog"
      :show-close="false"
      style="z-index: 10"
  >
    <div style="width: 100%; display: flex; justify-content: center">
      <el-tabs>
        <el-tab-pane label="通过定位">
          <div v-if="locateResult">
            <div
                style="width: 100%; display: flex; align-items: center; flex-direction: column; gap: 16px; padding: 20px 0;">
              <el-card style="width: calc(100% - 16px); margin: 0 8px">
                <div style="width: 100%; display: flex; align-items: center; justify-content: space-between">
                  <div v-if="gettingLocateCityInfo">
                    正在获取城市信息
                  </div>
                  <div v-else-if="locateNeedManualInputCityName">
                    <el-input v-model="locateCityName" placeholder="城市名称" style="width: 160px"/>
                  </div>
                  <div v-else style="display: flex; align-items: center; gap: 4px">
                    <div v-if="!/^\s*$/.test(locateCityName)">
                      {{ locateCityName }}
                    </div>
                    <div v-else>
                      未知城市
                    </div>
                    <el-button type="text" @click="locateNeedManualInputCityName = true">
                      <el-icon>
                        <Edit/>
                      </el-icon>
                    </el-button>
                  </div>

                  <div>
                    <div>
                      经 {{ locateResult!.longitude }}
                    </div>
                    <div>
                      纬 {{ locateResult!.latitude }}
                    </div>
                  </div>
                </div>
              </el-card>

              <el-button style="align-self: end" type="primary" :disabled="!geoLocationSubmittable"
                         @click="submitGeoLocation">
                添加
              </el-button>

            </div>
          </div>
          <div v-else-if="locatingCountdown > 0"
               style="width: 100%; display: flex; align-items: center; gap: 4px; justify-content: center">
            <el-icon>
              <Location/>
            </el-icon>
            <div>
              获取中({{ locatingCountdown }})……
            </div>
          </div>
          <div v-else>
            <el-icon>
              <WarningFilled/>
            </el-icon>
            <span>
              地理信息服务在当前环境下不可用
            </span>
            <br/>
            <br/>
            <el-icon>
              <QuestionFilled/>
            </el-icon>
            <span>
              您可以前往 lbs.amap.com/tools/picker
            </span>
            <a @click="cpy('https://lbs.amap.com/tools/picker')" class="styled-a-tag">
              高德坐标拾取器
            </a>
            <span>
              手动获取经纬度信息，然后在本页面第三栏 <span style="font-weight: bold">通过输入经纬度</span> 完善当前位置信息
            </span>
            <br/>
            <br/>
            <span>
              Tip: 精确的经纬度信息能够让您获取到的天气信息更加准确
            </span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="通过城市名搜索">
          <div style="width: 100%; display: flex; flex-direction: column; gap: 8px">
            <div style="display: flex; align-items: center; gap: 4px;">
              <el-icon>
                <Warning/>
              </el-icon>
              <div>
                通过城市中心获取到的天气信息并不会非常准确
              </div>
            </div>
            <el-input
                v-model="citySearchKey"
                placeholder="城市名称或城市ID"
                @keyup.enter="startSearch"
                :disabled="searching"
                v-loading="searching"
            >
              <template #prefix>
                <el-icon>
                  <Search/>
                </el-icon>
              </template>
            </el-input>
            <div v-if="searchResult == undefined" style="width: 100%; text-align: center">
              <el-empty description="请输入搜索内容并按下回车"/>
            </div>
            <div v-else-if="searchResult.length == 0" style="display: flex; justify-content: center">
              什么也没有搜到
            </div>
            <el-scrollbar max-height="300px" v-else style="display: flex; flex-direction: column">
              <el-card v-for="city in searchResult" style="margin: 8px 8px; cursor: pointer;"
                       @click="addCityCenter(city)">
                <div style="display: flex; width: 100%; justify-content: space-between; align-items: center">
                  <div style="display: flex; width: 100%; gap: 4px">
                    <div style="font-weight: bold">{{ city.province }}</div>
                    <div style="font-weight: bold">{{ city.city }}</div>
                    <div style="font-weight: bold">{{ city.district }}</div>
                  </div>
                  <div style="display: flex; flex-direction: column">
                    <div style="display: flex; gap: 4px">
                      <div>经</div>
                      <div>{{ city.longitude }}</div>
                    </div>
                    <div style="display: flex; gap: 4px">
                      <div>纬</div>
                      <div>{{ city.latitude }}</div>
                    </div>
                  </div>
                </div>

              </el-card>
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane label="通过输入经纬度">
          <div style="width: 100%; padding: 20px 0; display: flex; flex-direction: column; gap: 16px">
            <div>
              <el-icon>
                <QuestionFilled/>
              </el-icon>
              <span>
                您可以前往 lbs.amap.com/tools/picker
              </span>
              <a @click="cpy('https://lbs.amap.com/tools/picker')" class="styled-a-tag">
                高德坐标拾取器
              </a>
              <span>
                手动获取经纬度信息
              </span>
            </div>
            <el-card style="width: calc(100% - 16px); margin: 0 8px">
              <div style="width: 100%; display: flex; align-items: center; justify-content: space-between">
                <div style="display: flex; flex-direction: column">
                  <el-input v-model="inputLocationForm.name" placeholder="城市名称" style="width: 150px"/>
                  <el-button
                      :loading="gettingInputCityInfo"
                      type="text"
                      @click="getInputCityInfo"
                      v-if="getInputCityInfoAvailable">
                    自动获取
                  </el-button>
                </div>

                <div>
                  <div style="display: flex; align-items: center; gap: 4px">
                    <div style="font-weight: bold; font-size: large">
                      经
                    </div>
                    <el-input
                        v-model="inputLocationForm.longitude"
                        style="width: 120px"
                        placeholder="国内 73~136"
                        @input="handleLongitudeChange"
                    />
                  </div>

                  <div style="display: flex; align-items: center; gap: 4px">
                    <div style="font-weight: bold; font-size: large">
                      纬
                    </div>
                    <el-input
                        v-model="inputLocationForm.latitude"
                        ref="latitudeInput"
                        style="width: 120px"
                        placeholder="国内 3~54"
                    />
                  </div>
                </div>
              </div>
            </el-card>
            <el-button style="align-self: end" type="primary" :disabled="!inputCitySubmittable"
                       @click="submitInputCity">
              添加
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

  </el-dialog>
</template>

<style scoped>

</style>