<script setup lang="ts">
import {Comprehensive} from "../models/caiyunapi/comprehensive.ts";
import {computed, StyleValue, watch} from "vue";
import MainCard from "./MainCard.vue";
import {parseWeatherBackground} from "../utils/resource_parser.ts";

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
    <div style="position: fixed; width: 100%; height: 100%; top: 0; left: 0; z-index: -100;" :style="backgroundStyle"/>
    <div class="info-container">
      <el-card
          style="padding: 0"
          :body-style="{padding: '0'}"
          shadow="hover"
      >
        <MainCard :weather-info="weatherInfo" :background-style="backgroundStyle"/>
      </el-card>
    </div>

    <div class="info-container">
      <el-card
          style="padding: 0"
          :body-style="{padding: '0'}"
          shadow="hover"
      >
        <div class="info-size-1">

        </div>
      </el-card>
    </div>

    <div class="info-container" style="display: flex; gap: 24px">
      <div style="width: 50%">
        <el-card
            style="padding: 0"
            :body-style="{padding: '0'}"
            shadow="hover"
        >
          <div class="info-size-1">

          </div>
        </el-card>
      </div>
      <div style="width: 50%">
        <el-card
            style="padding: 0"
            :body-style="{padding: '0'}"
            shadow="hover"
        >
          <div class="info-size-1">

          </div>
        </el-card>
      </div>
    </div>

    <div class="info-container" style="display: flex; gap: 24px">
      <div style="width: 50%">
        <el-card
            style="padding: 0"
            :body-style="{padding: '0'}"
            shadow="hover"
        >
          <div class="info-size-1">

          </div>
        </el-card>
      </div>
      <div style="width: 50%">
        <el-card
            style="padding: 0"
            :body-style="{padding: '0'}"
            shadow="hover"
        >
          <div class="info-size-1">

          </div>
        </el-card>
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