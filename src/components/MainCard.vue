<script setup lang="ts">

import AQIBadge from "./AQIBadge.vue";
import {Comprehensive} from "../models/caiyunapi/comprehensive.ts";
import {computed, StyleValue} from "vue";

const props = defineProps<{
  weatherInfo: Comprehensive,
  backgroundStyle: StyleValue
}>();

const weatherInfo = computed(() => props.weatherInfo);
const backgroundStyle = computed(() => props.backgroundStyle);


</script>

<template>
  <div style="width: 100%; position: relative" class="info-size-2" :style="backgroundStyle">
    <div class="realtime-info-container">
      <div>
        <span class="main-white-text">
          {{ weatherInfo.timezone }}
        </span>
      </div>
      <el-row style="width: 100%;">
        <el-col :span="12">
          <div style="display: flex; flex-direction: column; align-self: start; margin: 20px; gap: 4px">
              <span class="main-white-text" style="align-self: start; font-size: xxx-large">
              {{ weatherInfo.result.realtime.temperature }}
              <span style="font-size: xx-large">℃</span>
            </span>
            <span class="secondary-white-text" style="align-self: start; font-size: small">
              体感 {{ weatherInfo.result.realtime.apparent_temperature }} ℃
            </span>
            <div style="display: flex; align-items: center; gap: 4px; align-self: start">
              <span class="secondary-white-text">
                空气指数 {{ weatherInfo.result.realtime.air_quality.aqi.chn }}
              </span>
              <AQIBadge :aqi="weatherInfo.result.realtime.air_quality.aqi.chn"/>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>

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