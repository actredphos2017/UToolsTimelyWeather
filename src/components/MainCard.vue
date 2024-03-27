<script setup lang="ts">

import AQIBadge from "./AQIBadge.vue";
import {Comprehensive} from "../models/caiyunapi/comprehensive.ts";
import {computed, StyleValue} from "vue";
import {parseWeatherIcon, parseWeatherName} from "../utils/resource_parser";
import AlertTip from "./AlertTip.vue";
import {formatDate} from "../utils/utils.ts";
import PrecipitationTip from "./PrecipitationTip.vue";
import {precipitationActive} from "../utils/precipitation_utils.ts";
import WindBadge from "./WindBadge.vue";

const props = defineProps<{
  weatherInfo: Comprehensive,
  backgroundStyle: StyleValue
}>();

const weatherInfo = computed(() => props.weatherInfo);
const backgroundStyle = computed(() => props.backgroundStyle);

const updateTime = computed(() => formatDate(weatherInfo.value.server_time));

</script>

<template>
  <div style="width: 100%; position: relative" class="info-size-2" :style="backgroundStyle">
    <div class="realtime-info-container">
      <div style="padding-top: 12px">
        <span class="main-white-text" style="font-size: large;">
          {{ weatherInfo.result.alert.adcodes.map(entry => entry.name).join(' ') }}
        </span>
      </div>
      <div style="display: flex; justify-content: space-between; width: 100%">
        <div class="side-info-wrapper" style="align-items: start">
          <div class="main-white-text" style=" font-size: xxx-large">
            <span>{{ weatherInfo.result.realtime.temperature }}</span>
            <span style="font-size: xx-large">℃</span>
          </div>
          <div class="secondary-white-text">
            体感 {{ weatherInfo.result.realtime.apparent_temperature }} ℃
          </div>
          <div style="display: flex; gap: 4px; align-items: center">
            <AQIBadge :aqi="weatherInfo.result.realtime.air_quality.aqi.chn"/>
            <span class="secondary-white-text">
              空气指数 {{ weatherInfo.result.realtime.air_quality.aqi.chn }}
            </span>
          </div>
          <div style="display: flex; gap: 4px; align-items: center">
            <img :src="parseWeatherIcon(weatherInfo.result.realtime.skycon)" alt="天气现象图标" style="width: 24px"/>
            <span class="secondary-white-text">{{ parseWeatherName(weatherInfo.result.realtime.skycon) }}</span>
          </div>
          <WindBadge
              :wind="weatherInfo.result.realtime.wind"
              outer-font-color="white"
          />
        </div>
        <div class="side-info-wrapper" style="align-items: end">
          <AlertTip
              v-for="alertContent in weatherInfo.result.alert.content"
              :key="alertContent.alertId"
              :alert-content="alertContent"
          />
          <PrecipitationTip
              :minutely-data="weatherInfo.result.minutely"
              v-if="precipitationActive(weatherInfo.result.minutely)"
          />
          <div class="secondary-white-text" style="font-size: smaller">
            {{ updateTime }} 更新
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.side-info-wrapper {
  display: flex;
  flex-direction: column;
  margin: 20px;
  gap: 4px;
  justify-content: end;
}

.realtime-info-container {
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

</style>