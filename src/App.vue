<script setup lang="ts">
import {Comprehensive} from "./models/caiyunapi/comprehensive.ts";
import {onMounted, ref, watch} from "vue";
import WeatherPanel from "./components/WeatherPanel.vue";
import {ElLoading, ElMessage} from "element-plus";
import TopBar from "./components/TopBar.vue";
import {SavableLocation} from "./models/city_center.ts";
import {useLocationListStore, useSettingStore, useWeatherHistoryStore} from "./plugins/store.ts";
import AddLocationDialog from "./components/AddLocationDialog.vue";
import TokenEnterDialog from "./components/TokenEnterDialog.vue";
import GuideDialog from "./components/GuideDialog.vue";

const weatherHistory = useWeatherHistoryStore();
const cityList = useLocationListStore();
const settings = useSettingStore();

const weatherInfo = ref<undefined | Comprehensive>();

const checkRequirement = () => cityList.userLocations.length > 0 && !(/^\s*$/.test(settings.caiyunToken));

function startGuide() {
  displayGuideDialog.value = true
}

function initApp() {
  if (checkRequirement()) {
    if (cityList.userLocations.length > 0) {
      targetLocation.value = cityList.userLocations[cityList.favoriteIndex];
    } else {
      toAddCity();
    }
  } else {
    startGuide();
  }
}

onMounted(() => {
  initApp();
});

const targetLocation = ref<SavableLocation | undefined>();

function toEnterApiToken() {
  displayTokenEnterDialog.value = true;
}

const cityAddDialog = ref(false);

const displayTokenEnterDialog = ref(false);

const displayGuideDialog = ref(false);

function toAddCity() {
  cityAddDialog.value = true;
}

function updateWeather(force: boolean = false) {
  if (targetLocation.value) {
    gettingInfo.value = true
    weatherHistory
        .updateHistory(targetLocation.value, force)
        .then(res => {
          weatherInfo.value = res
        })
        .catch((status: {
          code: number,
          oldData?: Comprehensive
        }) => {
          if (status.oldData) {
            weatherInfo.value = status.oldData
          }
          switch (status.code) {
            case 0: {
              toEnterApiToken();
              ElMessage.error('未提供彩云天气 TOKEN');
              break;
            }
            case 1: {
              ElMessage.error('请求超时，请检查网络设置');
              break;
            }
            case 2: {
              ElMessage.error('请求过于频繁，请稍后重试');
              break;
            }
            case 400: {
              toEnterApiToken();
              ElMessage.error('彩云天气 TOKEN 不正确');
              break;
            }
            case 422: {
              ElMessage.error('目标地区不可用');
              break;
            }
            case 429: {
              ElMessage.error('请求过于频繁，请稍后重试');
              break;
            }
            default: {
              ElMessage.error(`请求失败，状态码 ${status}`)
              break;
            }
          }
        })
        .finally(() => {
          gettingInfo.value = false;
        })
  }
}


watch(targetLocation, () => {
  updateWeather()
}, {immediate: true});

const gettingInfo = ref(false);

let loading: any;

watch(gettingInfo, newValue => {
  if (newValue) {
    loading = ElLoading.service({
      lock: true,
      text: '正在获取天气信息，请稍后……',
      background: 'rgba(0, 0, 0, 0.7)',
    });
  } else {
    if (loading) {
      loading.close()
      loading = null;
    }
  }
}, {immediate: true});

function switchCity(index: number) {
  targetLocation.value = cityList.userLocations[index];
}

</script>

<template>
  <div style="position: absolute; width: 100%; z-index: 100">
    <TopBar
        :on-add-city="toAddCity"
        :on-setting="toEnterApiToken"
        :on-switch-to-city="switchCity"
        :on-refresh="() => updateWeather(true)"
    />
  </div>
  <div v-if="weatherInfo" style="width: 100%">
    <WeatherPanel :weather-info="weatherInfo"/>
  </div>
  <div class="failed-content-container" v-else-if="!gettingInfo">
    <el-text>获取失败</el-text>
  </div>

  <AddLocationDialog
      v-model="cityAddDialog"
  />

  <TokenEnterDialog
      v-model="displayTokenEnterDialog"
  />

  <GuideDialog
      v-model="displayGuideDialog"
      :on-set-locations="toAddCity"
      :on-set-token="toEnterApiToken"
      :on-finish="initApp"
  />

</template>

<style scoped>

.failed-content-container {
  display: flex;
  gap: 8px;
  flex-direction: column;
  width: 100%;
  height: 90vh;
  align-items: center;
  justify-content: center
}

</style>
