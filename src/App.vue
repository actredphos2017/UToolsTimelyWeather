<script setup lang="ts">
import {Comprehensive, ComprehensiveErrorData} from "./models/caiyunapi/comprehensive.ts";
import {onMounted, ref, watch} from "vue";
import WeatherPanel from "./components/WeatherPanel.vue";
import {ElLoading, ElMessage} from "element-plus";
import TopBar from "./components/TopBar.vue";
import {SavableLocation} from "./models/city_center.ts";
import {useLocationListStore, useWeatherHistoryStore} from "./plugins/store.ts";
import AddLocationDialog from "./components/AddLocationDialog.vue";
import TokenEnterDialog from "./components/TokenEnterDialog.vue";

const weatherHistory = useWeatherHistoryStore();
const cityList = useLocationListStore();

const weatherInfo = ref<undefined | Comprehensive>();

onMounted(() => {
  console.log(cityList.favoriteIndex)
  console.log(cityList.userLocations.length);
  if (cityList.favoriteIndex) {
    targetLocation.value = cityList.userLocations[cityList.favoriteIndex];
  } else if (cityList.userLocations.length > 0) {
    targetLocation.value = cityList.userLocations[0];
  } else {
    addCity();
  }
})

const targetLocation = ref<SavableLocation | undefined>();

function toEnterApiToken() {
  console.log('a')
  displayTokenEnterDialog.value = true;
}

const cityAddDialog = ref(false);

const displayTokenEnterDialog = ref(false);

function addCity() {
  cityAddDialog.value = true;
}

function updateWeather() {
  if (targetLocation.value) {
    weatherHistory
        .updateHistory(targetLocation.value)
        .then(res => {
          weatherInfo.value = res
        })
        .catch((e: ComprehensiveErrorData | undefined) => {
          if (e) {
            switch (e.error) {
              case "token is invalid": {
                toEnterApiToken();
                ElMessage.error('彩云天气 TOKEN 不可用');
                break;
              }
              case "'latitude out of bounds!'": {
                ElMessage.error('目标地区不可用');
                break;
              }
              default: {
                ElMessage.error(e.error)
                break;
              }
            }
          } else {
            ElMessage.error('远程服务不可用，请检查你的网络设置');
          }
        });
  }
}


watch(targetLocation, updateWeather, {immediate: true});

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
        :on-add-city="addCity"
        :on-setting="toEnterApiToken"
        :on-switch-to-city="switchCity"
        :on-refresh="updateWeather"
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
