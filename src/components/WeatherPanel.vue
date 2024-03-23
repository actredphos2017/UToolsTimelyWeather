<script setup lang="ts">

import {Comprehensive} from "../models/caiyunapi/comprehensive.ts";
import {computed, StyleValue, watch} from "vue";
import {parseWeatherBackground} from "../utils/resource_parser.ts";

const props = defineProps<{
  weatherInfo: Comprehensive
}>();

const weatherInfo = computed(() => props.weatherInfo);

const realtimeWeatherBackground = computed(
    () => parseWeatherBackground(
        weatherInfo.value.result.realtime.skycon,
        weatherInfo.value.server_time
    )
)

watch(weatherInfo, newValue => {
  console.log('Update:', newValue)
}, {immediate: true});

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
    <el-card
        class="info-card"
        style="padding: 0"
        :body-style="{padding: '0'}"
        shadow="hover"
    >
      <div style="width: 100%; position: relative" class="info-size-2" :style="backgroundStyle">
        <div class="realtime-info-container">
          <div>
            <el-text class="main-white-text">
              {{ weatherInfo.timezone }}
            </el-text>
          </div>
          <div style="display: flex; flex-direction: column; align-self: start; margin: 20px; gap: 4px">
            <el-text class="main-white-text" style="align-self: start; font-size: xxx-large">
              {{ weatherInfo.result.realtime.temperature }}℃
            </el-text>
            <el-text class="secondary-white-text" style="align-self: start; font-size: medium">
              体感 {{ weatherInfo.result.realtime.apparent_temperature }}℃
            </el-text>
            {{ weatherInfo.result.realtime.air_quality.aqi.chn }}
          </div>
        </div>
      </div>


    </el-card>
  </div>
</template>

<style scoped>

.content-container {
  width: 100%;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
  align-items: center;
  justify-content: center;
}

.main-white-text {
  color: rgba(255, 255, 255, 0.8);
}

.secondary-white-text {
  color: rgba(224, 224, 224, 0.8);
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