<script setup lang="ts">
import {
  Comprehensive,
  // getComprehensiveTestFailed,
  getComprehensiveTestSuccess
} from "./models/caiyunapi/comprehensive.ts";
import {onMounted, ref, watch} from "vue";
import WeatherPanel from "./components/WeatherPanel.vue";
import {ElLoading} from "element-plus";

const weatherInfo = ref<null | Comprehensive>(null)

onMounted(() => {
  updateWeather()
});

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
}, {immediate: true})

function updateWeather() {
  gettingInfo.value = true;
  getComprehensiveTestSuccess('TOKEN')
      .then(res => {
        console.log(res);
        weatherInfo.value = res;
      })
      .catch(e => {
        console.log(e);
        weatherInfo.value = null;
      })
      .finally(() => {
        gettingInfo.value = false;
      })
}

</script>

<template>
  <WeatherPanel v-if="weatherInfo" :weather-info="weatherInfo"/>
  <div class="failed-content-container" v-else-if="!gettingInfo" @click="updateWeather">
    <el-text>获取失败</el-text>
    <el-button @click="updateWeather">点击重试</el-button>
  </div>
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
