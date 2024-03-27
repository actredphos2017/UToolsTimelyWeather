<script setup lang="ts">

import {locateIcon, windArrowIcon} from "../utils/icons.ts";
import {computed, StyleValue} from "vue";

const props = defineProps<{
  windDirection: number,
  windStrength: number
}>();

const windDirection = computed(() => props.windDirection);
const windStrength = computed(() => props.windStrength);

const arrowStyle = computed<StyleValue>(() => ({
  transformOrigin: 'center center',
  transform: `rotate(${windDirection}deg)`
}));

</script>

<template>
  <div style="display: flex; align-items: center; gap: 4px">
    <div style="width: 64px; height: 64px; position: relative; display: flex; justify-content: center; align-items: center">
      <el-icon size="32px" style="position: absolute" v-html="locateIcon.template"/>
      <el-icon size="64px" style="position: absolute" :style="arrowStyle" v-html="windArrowIcon.template"/>
    </div>
    <div>
      {{ windStrength }} km/h
    </div>
  </div>
</template>

<style scoped>

</style>