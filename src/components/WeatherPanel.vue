<script setup lang="ts">
import {Comprehensive} from "../models/caiyunapi/comprehensive.ts";
import {computed, StyleValue, watch} from "vue";
import MainCard from "./MainCard.vue";
import {parseWeatherBackground} from "../utils/resource_parser.ts";
import HourlyCard from "./HourlyCard.vue";
import DailyCard from "./DailyCard.vue";
import {caiyunIcon} from "../utils/icons.ts";
import BlurCard from "./BlurCard.vue";

const props = defineProps<{
  weatherInfo: Comprehensive
}>();

const weatherInfo = computed(() => props.weatherInfo);

watch(weatherInfo, newValue => {
  console.log('Update:', newValue)
}, {immediate: true});

const realtimeWeatherBackground = computed(
    () => parseWeatherBackground(
        weatherInfo.value.result.realtime.skycon,
        weatherInfo.value.server_time
    )
);

const backgroundStyle = computed<StyleValue>(() => {
  return {
    backgroundImage: `url('${realtimeWeatherBackground.value}')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  } as StyleValue
});

</script>

<template>
  <div class="content-container">
    <div :style="backgroundStyle" style="position: fixed; width: 100%; height: 100%; top: 0; z-index: -3"/>
    <div class="info-container">
      <el-card
          style="padding: 0; background-color: rgba(255, 255, 255, 0.6)"
          :body-style="{padding: '0'}"
          shadow="hover"
      >
        <MainCard :weather-info="weatherInfo" :background-style="backgroundStyle"/>
      </el-card>
    </div>

    <div class="info-container">
      <BlurCard :realtime-weather-background="realtimeWeatherBackground" info-size="info-size-1">
        <HourlyCard :hourly-data="weatherInfo.result.hourly"/>
      </BlurCard>
    </div>

    <div class="info-container" style="display: flex; gap: 24px">
      <div style="width: 50%">
        <BlurCard info-size="info-size-1" :realtime-weather-background="realtimeWeatherBackground" />
      </div>
      <div style="width: 50%">
        <BlurCard info-size="info-size-1" :realtime-weather-background="realtimeWeatherBackground" />
      </div>
    </div>

    <div class="info-container" style="display: flex; gap: 24px">
      <div style="width: 50%">
        <BlurCard info-size="info-size-1" :realtime-weather-background="realtimeWeatherBackground" />
      </div>
      <div style="width: 50%">
        <BlurCard info-size="info-size-1" :realtime-weather-background="realtimeWeatherBackground" />
      </div>
    </div>

    <div class="info-container">
      <BlurCard info-size="info-size-2" :realtime-weather-background="realtimeWeatherBackground" >
        <DailyCard :daily-data="weatherInfo.result.daily"/>
      </BlurCard>
    </div>

    <div style="display: flex; align-items: center; gap: 4px">
      <div class="secondary-white-text" style="font-size: smaller">
        数据源
      </div>
      <el-icon size="28px" v-html="caiyunIcon.template"/>
      <div class="main-white-text">
        彩云天气
      </div>
      <div class="secondary-white-text" style="font-size: smaller;">
        API
      </div>
    </div>

  </div>
</template>

<style scoped>

.content-container {
  width: 100%;
  min-height: 90vh;
  height: fit-content;
  padding: 20px 0;
  display: flex;
  gap: 24px;
  flex-direction: column;
  overflow-x: hidden;
  align-items: center;
  justify-content: center;
  position: relative;
}

</style>