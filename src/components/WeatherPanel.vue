<script setup lang="ts">

import {Comprehensive} from "../models/caiyunapi/comprehensive.ts";
import {computed, watch} from "vue";

const props = defineProps<{
  weatherInfo: Comprehensive
}>();

const weatherInfo = computed(() => props.weatherInfo);

watch(weatherInfo, newValue => {
  console.log('Update:', newValue)
}, {immediate: true});

</script>

<template>
  <div class="content-container">
    <el-card
        class="info-card double-size-info"
        :body-style="{padding: '0px'}"
        shadow="hover"
    >



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

.info-card {
  width: 100%;
  padding: 8px;
}

.single-size-info {
  height: 400px;
}

.double-size-info {
  height: 200px;
}

</style>