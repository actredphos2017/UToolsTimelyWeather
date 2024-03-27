<script setup lang="ts">

import {windDirectionContainer} from "../utils/icons.ts";
import {computed, StyleValue} from "vue";
import {parseWindLevelDescription} from "../utils/utils.ts";

interface Props {
  wind: {
    direction: number,
    speed: number
  },
  backgroundColor: string,
  innerFontColor: string,
  outerFontColor: string
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: '#00cdff',
  innerFontColor: '#ffffff',
  outerFontColor: '#000000',
});

const windDirection = computed(() => props.wind.direction);
const windSpeed = computed(() => props.wind.speed);

const arrowStyle = computed<StyleValue>(() => ({
  transformOrigin: 'center center',
  transform: `rotate(${windDirection.value}deg)`
}));

const windInfo = computed(() => parseWindLevelDescription(windSpeed.value))


</script>

<template>
  <div style="display: flex; gap: 6px; align-items: center">
    <div class="badge-container">
      <el-icon
          size="48"
          :color="props.backgroundColor"
          style="position: absolute"
          :style="arrowStyle"
          v-html="windDirectionContainer.template"
      />
      <div class="inner-font" :style="{color: props.innerFontColor}">
        <div style="font-size: x-large; font-weight: bolder">
          {{ Math.round(windSpeed * 10) / 10 }}
        </div>
        <div style="font-size: xx-small; font-weight: bolder; transform: translateY(-4px)">
          km/h
        </div>
      </div>
    </div>
    <div :style="{color: props.outerFontColor}" style="display: flex; flex-direction: column; align-items: start">
      <div style="font-size: small">
        {{ windInfo.levelName }}
      </div>
      <div style="font-size: small">
        {{ windInfo.desc }}
      </div>
    </div>
  </div>

</template>

<style scoped>

.badge-container {
  width: 37px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center
}

.inner-font {
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: scale(0.6) translateY(3px);
}

</style>