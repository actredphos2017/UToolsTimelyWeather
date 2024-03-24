<script setup lang="ts">

import {aqiColorMapper, calculateAqiLevel} from "../utils/aqi_calculater.ts";
import {computed} from "vue";

const props = defineProps<{
  aqi: number
}>();

const apiLevel = computed(() => calculateAqiLevel(props.aqi));

</script>

<template>
  <div
      style="width: 20px; height: 20px; border-radius: 10px; display: flex; align-items: center; justify-content: center"
      :style="{backgroundColor: aqiColorMapper[apiLevel]}">
    <el-text style="color: white; font-size: 12px">
      {{ apiLevel.substring(0, 1) }}
    </el-text>
  </div>
</template>

<style scoped>

</style>