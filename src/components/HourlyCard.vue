<script setup lang="ts">

import {HourlyData} from "../models/caiyunapi/hourly.ts";
import {computed, ref, watch} from "vue";
import {definePositionMapper, definePositionMapperOf} from "../utils/canvas_utils.ts";
import {getHourlyInstances, getTimeRoundToMinuteString, HourlyInstance} from "../utils/utils.ts";
import {hourlyIcon} from "../utils/icons.ts";
import {parseWeatherIcon, parseWeatherName} from "../utils/resource_parser.ts";
import {InfoFilled} from "@element-plus/icons-vue";
import AQIBadge from "./AQIBadge.vue";
import TipCard from "./TipCard.vue";
import {nextFrame} from "../utils";

const props = defineProps<{
  hourlyData: HourlyData
}>();

const hourlyInstances = computed(() => getHourlyInstances(props.hourlyData));

const graph = ref<HTMLCanvasElement>();

watch([graph, hourlyInstances], updateGraph, {immediate: true});


const canvasWidth = ref(0);
const canvasHeight = 200;
const unitWidth = 64;

const canvasSizeStyle = computed(() => ({width: `${canvasWidth.value}px`, height: `${canvasHeight}px`}));

async function updateGraph() {
  if (!graph.value) return;
  canvasWidth.value = hourlyInstances.value.length * unitWidth;
  await nextFrame();
  const dpr = window.devicePixelRatio;
  const originSize = {
    width: canvasWidth.value * dpr,
    height: canvasHeight * dpr
  };
  graph.value.width = originSize.width;
  graph.value.height = originSize.height;
  await nextFrame();

  let ctx = graph.value.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, originSize.width, originSize.height);

  const virtualSize = canvasWidth.value * 10;
  const defaultMapper = definePositionMapper({
    virtualSize,
    canvasInstance: graph.value
  });

  const temperatures = hourlyInstances.value.map(e => e.temperature);
  const maxTemperature = Math.max(...temperatures.map(e => (e ?? 0)));
  const minTemperature = Math.min(...temperatures.map(e => (e ?? 0)));
  const eachWidth = virtualSize / hourlyInstances.value.length;

  // 画分割线
  const [divisionLineGradientStartX, divisionLineGradientStartY] = defaultMapper(0, 0);
  const [divisionLineGradientEndX, divisionLineGradientEndY] = defaultMapper(0, virtualSize);
  const divisionLineGradient = ctx.createLinearGradient(
      divisionLineGradientStartX,
      divisionLineGradientStartY,
      divisionLineGradientEndX,
      divisionLineGradientEndY
  );
  divisionLineGradient.addColorStop(0, 'rgba(0,0,0,0)');
  divisionLineGradient.addColorStop(0.5, 'rgba(0,0,0,0.5)');
  divisionLineGradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = divisionLineGradient;
  ctx.lineWidth = dpr;
  for (let i = 1; i < hourlyInstances.value.length; i++) {
    const x = eachWidth * i;
    const [startX, startY] = defaultMapper(x, virtualSize);
    const [endX, endY] = defaultMapper(x, 0);
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
  }
  ctx.stroke();
  ctx.save();

  // 温度折线图点位
  const graphMapper = definePositionMapperOf(
      graph.value!,
      virtualSize,
      0,
      0,
      100 * dpr,
      50 * dpr
  );
  const points = temperatures.map(
      (value, index) => ({
        position: graphMapper(
            eachWidth * index + eachWidth / 2,
            virtualSize * ((value ?? 0) - minTemperature) / (maxTemperature - minTemperature)
        ),
        temperatureText: `${Math.round(value ?? 0)}℃`
      })
  );
  const [graphRBX, graphRBY] = graphMapper(virtualSize - eachWidth / 2, 0);
  const [graphLBX, graphLBY] = graphMapper(eachWidth / 2, 0);
  const [graphLTX, graphLTY] = graphMapper(eachWidth / 2, virtualSize);

  // 画线
  ctx.strokeStyle = '#0081ff';
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i == 0) {
      ctx.moveTo(p.position[0], p.position[1]);
    } else {
      ctx.lineTo(p.position[0], p.position[1]);
    }
  });
  ctx.stroke();
  ctx.lineTo(graphRBX, graphRBY);
  ctx.lineTo(graphLBX, graphLBY);
  ctx.closePath();
  const shadowStyle = ctx.createLinearGradient(graphLTX, graphLTY, graphLBX, graphLBY);
  shadowStyle.addColorStop(0, 'rgba(113,130,255,0.5)');
  shadowStyle.addColorStop(1, 'rgba(113,130,255,0)');
  ctx.fillStyle = shadowStyle;
  ctx.fill();
  ctx.save();

  // 画圆
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#0081ff';
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.position[0], p.position[1], 3 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  });
  ctx.save();

  // 写温度
  points.forEach(p => {
    ctx.save();
    ctx.translate(p.position[0], p.position[1]);
    ctx.rotate(-20 * Math.PI / 180);
    ctx.font = `${13 * dpr}px Arial`;
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.fillText(p.temperatureText, 6, -5);
    ctx.restore();
  });
}

const tipVisible = ref(false);
const targetHourlyInstance = ref<HourlyInstance | null>(null);

function mouseEnterDetailBlock(hourlyInstance: HourlyInstance) {
  targetHourlyInstance.value = hourlyInstance;
  tipVisible.value = true;
}

function mouseLeaveDetailBlock() {
  targetHourlyInstance.value = null;
  tipVisible.value = false;
}

</script>

<template>
  <div style="height: 40px; display: flex; gap: 4px; align-items: center; padding-left: 12px">
    <el-icon v-html="hourlyIcon.template" size="24px"/>
    <div class="main-black-text" style="font-size: large">
      小时天气
    </div>
  </div>
  <div style="height: 210px;">
    <el-scrollbar>
      <div style="position: relative">
        <canvas ref="graph" style="position: absolute"
                :style="canvasSizeStyle"/>
        <div
            style="display: flex"
            :style="canvasSizeStyle"
            @mouseleave="mouseLeaveDetailBlock"
        >
          <div
              v-for="hourlyInstance in hourlyInstances"
              :key="hourlyInstance.date.getTime()"

              class="detail-block"
              style="z-index: 10; display: flex; flex-direction: column; justify-content: space-between"
              :style="{width: `${unitWidth}px`, height: `${canvasHeight}px`}"
              @mouseenter="mouseEnterDetailBlock(hourlyInstance)"
          >
            <div v-if="hourlyInstance.skycon"
                 style="width: 100%; display: flex; align-items: center; flex-direction: column; gap: 4px">
              <img :src="parseWeatherIcon(hourlyInstance.skycon)" style="width: 32px" alt="天气图标"/>
              <span class="secondary-black-text" style="font-size: small; font-weight: bold">
                    {{ parseWeatherName(hourlyInstance.skycon) }}
                  </span>
            </div>
            <div class="secondary-black-text"
                 style="width: 100%; text-align: center; padding-bottom: 16px; font-size: medium">
              {{ getTimeRoundToMinuteString(hourlyInstance.date) }}
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>

  <TipCard v-if="tipVisible && targetHourlyInstance">
    <div style="width: 300px; display: flex; flex-direction: column">
      <div style="display: flex; align-items: center; gap: 4px">
        <el-icon>
          <InfoFilled/>
        </el-icon>
        <div>
          {{ targetHourlyInstance.date.toLocaleString() }}
        </div>
      </div>
      <div style="font-size: large">
        {{ targetHourlyInstance.temperature }}℃
      </div>
      <div style="font-size: medium">
        体感 {{ targetHourlyInstance.apparent_temperature }}℃
      </div>
      <div v-if="targetHourlyInstance.skycon"
           style="font-size: medium; display: flex; align-items: center; gap: 4px; height: 40px">
        <span>{{ parseWeatherName(targetHourlyInstance.skycon) }}</span>
        <img :src="parseWeatherIcon(targetHourlyInstance.skycon)" style="width: 32px" alt="天气图标"/>
        <div v-if="targetHourlyInstance.precipitation && targetHourlyInstance.precipitation.probability > 0"
             style="display: flex; flex-direction: column; font-size: small; color: #66aaf3">
          <span>{{ targetHourlyInstance.precipitation!.probability }}%</span>
          <span>{{ targetHourlyInstance.precipitation!.value }}mm</span>
        </div>
      </div>
      <div v-if="targetHourlyInstance.aqi" style="display: flex; align-items: center; gap: 4px">
        <span>空气污染指数 {{ targetHourlyInstance.aqi!.chn }}</span>
        <AQIBadge :aqi="targetHourlyInstance.aqi.chn"/>
      </div>
      <div>
        PM2.5 {{ targetHourlyInstance.pm25 }}
      </div>
      <div>
        能见度 {{ targetHourlyInstance.visibility }}
      </div>
      <div>
        气压 {{ targetHourlyInstance.pressure }}
      </div>
      <div>
        相对湿度 {{ targetHourlyInstance.humidity }}
      </div>
      <div>
        云量 {{ targetHourlyInstance.cloudrate }}
      </div>
      <div>
        向下短波辐射通量 {{ targetHourlyInstance.dswrf }}W/M2
      </div>
    </div>
  </TipCard>
</template>

<style scoped>

.detail-block {
  height: 100%;
}

.detail-block:hover {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0) 100%);
}

</style>