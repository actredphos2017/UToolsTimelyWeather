<script setup lang="ts">

import {DailyData} from "../models/caiyunapi/daily.ts";
import {computed, ref, watch} from "vue";
import {DailyInstance, getDailyInstance, getFriendlyDateString} from "../utils/utils.ts";
import {definePositionMapper, definePositionMapperOf} from "../utils/canvas_utils.ts";
import {dailyIcon} from "../utils/icons.ts";
import {parseWeatherIcon, parseWeatherName} from "../utils/resource_parser.ts";
import TipCard from "./TipCard.vue";
import {Bottom, InfoFilled, Top} from "@element-plus/icons-vue";
import AQIBadge from "./AQIBadge.vue";
import WindBadge from "./WindBadge.vue";
import {nextFrame} from "../utils";

const props = defineProps<{
  dailyData: DailyData
}>();

const dailyInstances = computed(() => getDailyInstance(props.dailyData));

const graph = ref<HTMLCanvasElement>();

watch([dailyInstances, graph], updateGraph, {immediate: true});

const canvasWidth = ref(0);
const canvasHeight = 200;
const unitWidth = 80;

const canvasSizeStyle = computed(() => ({width: `${canvasWidth.value}px`, height: `${canvasHeight}px`}));

async function updateGraph() {
  if (!graph.value) return;
  canvasWidth.value = dailyInstances.value.length * unitWidth;
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

  const maxTemperatures = dailyInstances.value.map(e => e.temperature?.max ?? 0);
  const minTemperatures = dailyInstances.value.map(e => e.temperature?.min ?? 0);

  const maxTemperature = Math.max(...maxTemperatures);
  const minTemperature = Math.min(...minTemperatures);
  const eachWidth = virtualSize / dailyInstances.value.length;


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
  for (let i = 1; i < dailyInstances.value.length; i++) {
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
      76 * dpr,
      46 * dpr
  );
  const maxPoints = maxTemperatures.map(
      (value, index) => ({
        position: graphMapper(
            eachWidth * index + eachWidth / 2,
            virtualSize * ((value ?? 0) - minTemperature) / (maxTemperature - minTemperature)
        ),
        temperatureText: `${Math.round(value ?? 0)}℃`
      })
  );
  const minPoints = minTemperatures.map(
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

  // 画高位线及其阴影
  ctx.strokeStyle = '#007fff';
  ctx.lineWidth = dpr;
  ctx.beginPath();
  maxPoints.forEach((p, i) => {
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

  // 画低位线
  ctx.strokeStyle = '#0080ff';
  ctx.beginPath();
  minPoints.forEach((p, i) => {
    if (i == 0) {
      ctx.moveTo(p.position[0], p.position[1]);
    } else {
      ctx.lineTo(p.position[0], p.position[1]);
    }
  });
  ctx.stroke();
  ctx.save();

  // 画圆
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#0081ff';
  [maxPoints, minPoints].forEach(ps => ps.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.position[0], p.position[1], 3 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }));
  ctx.save();
}

const tipVisible = ref(false);
const targetDailyInstance = ref<DailyInstance | null>(null);

function mouseEnterDetailBlock(dailyInstance: DailyInstance) {
  targetDailyInstance.value = dailyInstance;
  tipVisible.value = true;
}

function mouseLeaveDetailBlock() {
  targetDailyInstance.value = null;
  tipVisible.value = false;
}

</script>

<template>
  <div style="height: 40px; display: flex; gap: 4px; align-items: center; padding-left: 12px">
    <el-icon v-html="dailyIcon.template" size="24px"/>
    <span class="main-black-text" style="font-size: large">
      未来天气
    </span>
  </div>
  <div style="height: 210px">
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
              v-for="dailyInstance in dailyInstances"
              :key="dailyInstance.date.getTime()"

              class="detail-block"
              style="z-index: 10; display: flex; flex-direction: column; justify-content: space-between; align-items: center"
              :style="{width: `${unitWidth}px`, height: `${canvasHeight}px`}"
              @mouseenter="mouseEnterDetailBlock(dailyInstance)"
          >

            <div
                style="height: 72px; margin-bottom: 10px; display: flex; flex-direction: column; align-items: center; justify-content: space-between">
              <div class="main-black-text" style="font-weight: 500">
                {{ getFriendlyDateString(dailyInstance.date) }}
              </div>
              <div style="display: flex; flex-direction: column; align-items: center">
                <img :src="parseWeatherIcon(dailyInstance.skycon_08h_20h)" style="width: 24px;" alt="天气图标"/>
                <div class="secondary-black-text" style="font-size: small">
                  {{ Math.round((dailyInstance.temperature?.max ?? 0) * 10) / 10 }}℃
                </div>
              </div>

            </div>
            <div
                style="margin-top: 10px; display: flex; flex-direction: column; align-items: center; justify-content: end">
              <div class="secondary-black-text" style="font-size: small">
                {{ Math.round((dailyInstance.temperature?.min ?? 0) * 10) / 10 }}℃
              </div>
              <img :src="parseWeatherIcon(dailyInstance.skycon_20h_32h)" style="width: 24px;" alt="天气图标"/>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>

  <TipCard v-if="tipVisible && targetDailyInstance">
    <div style="display: flex; flex-direction: column; gap: 8px">

      <div style="display: flex; align-items: center; gap: 4px">
        <el-icon>
          <InfoFilled/>
        </el-icon>
        <div>
          {{ targetDailyInstance.date.toLocaleDateString() }}
        </div>
      </div>

      <div style="width: 100%; display: flex; justify-content: space-around">

        <div style="display: flex; flex-direction: column; align-items: center">
          <div style="font-weight: 600">
            综合
          </div>
          <div style="display: flex; font-size: small; align-items: center; color: #66aaf3">
            <img :src="parseWeatherIcon(targetDailyInstance.skycon)" style="width: 32px;" alt="综合天气图标"/>
            <div v-if="targetDailyInstance.precipitation && targetDailyInstance.precipitation.probability > 0">
              {{ targetDailyInstance.precipitation!.probability }}%
            </div>
          </div>
          <div>
            {{ parseWeatherName(targetDailyInstance.skycon) }}
          </div>
          <div style="display: flex; align-items: center; width: 100%; justify-content: space-between">
            <el-icon color="#ff4231">
              <Top/>
            </el-icon>
            <div>{{ Math.round((targetDailyInstance.temperature?.max ?? 0) * 10) / 10 }}℃</div>
          </div>
          <div style="display: flex; align-items: center; width: 100%; justify-content: space-between">
            <el-icon color="#399aff">
              <Bottom/>
            </el-icon>
            <div>{{ Math.round((targetDailyInstance.temperature?.min ?? 0) * 10) / 10 }}℃</div>
          </div>
          <div>
            <WindBadge
                v-if="targetDailyInstance.wind"
                :wind="targetDailyInstance.wind!.avg"
            />
          </div>
        </div>


        <el-divider direction="vertical" style="height: 100px; align-self: center"/>


        <div style="display: flex; flex-direction: column; align-items: center">
          <div style="font-weight: 600">
            日间
          </div>
          <div style="display: flex; font-size: small; align-items: center; color: #66aaf3">
            <img :src="parseWeatherIcon(targetDailyInstance.skycon_08h_20h)" style="width: 32px;" alt="综合天气图标"/>
            <div
                v-if="targetDailyInstance.precipitation_08h_20h && targetDailyInstance.precipitation_08h_20h.probability > 0">
              {{ targetDailyInstance.precipitation_08h_20h!.probability }}%
            </div>
          </div>
          <div>
            {{ parseWeatherName(targetDailyInstance.skycon_08h_20h) }}
          </div>
          <div style="display: flex; align-items: center; width: 100%; justify-content: space-between">
            <el-icon color="#ff4231">
              <Top/>
            </el-icon>
            <div>{{ Math.round((targetDailyInstance.temperature_08h_20h?.max ?? 0) * 10) / 10 }}℃</div>
          </div>
          <div style="display: flex; align-items: center; width: 100%; justify-content: space-between">
            <el-icon color="#399aff">
              <Bottom/>
            </el-icon>
            <div>{{ Math.round((targetDailyInstance.temperature_08h_20h?.min ?? 0) * 10) / 10 }}℃</div>
          </div>
          <div>
            <WindBadge
                v-if="targetDailyInstance.wind_08h_20h"
                :wind="targetDailyInstance.wind_08h_20h!.avg"
            />
          </div>
        </div>


        <el-divider direction="vertical" style="height: 100px; align-self: center"/>


        <div style="display: flex; flex-direction: column; align-items: center">
          <div style="font-weight: 600">
            夜间
          </div>
          <div style="display: flex; font-size: small; align-items: center; color: #66aaf3">
            <img :src="parseWeatherIcon(targetDailyInstance.skycon_20h_32h)" style="width: 32px;" alt="综合天气图标"/>
            <div
                v-if="targetDailyInstance.precipitation_20h_32h && targetDailyInstance.precipitation_20h_32h.probability > 0">
              {{ targetDailyInstance.precipitation_20h_32h!.probability }}%
            </div>
          </div>
          <div>
            {{ parseWeatherName(targetDailyInstance.skycon_20h_32h) }}
          </div>
          <div style="display: flex; align-items: center; width: 100%; justify-content: space-between">
            <el-icon color="#ff4231">
              <Top/>
            </el-icon>
            <div>{{ Math.round((targetDailyInstance.temperature_20h_32h?.max ?? 0) * 10) / 10 }}℃</div>
          </div>
          <div style="display: flex; align-items: center; width: 100%; justify-content: space-between">
            <el-icon color="#399aff">
              <Bottom/>
            </el-icon>
            <div>{{ Math.round((targetDailyInstance.temperature_20h_32h?.min ?? 0) * 10) / 10 }}℃</div>
          </div>
          <div>
            <WindBadge
                v-if="targetDailyInstance.wind_20h_32h"
                :wind="targetDailyInstance.wind_20h_32h!.avg"
            />
          </div>
        </div>
      </div>

      <div class="detail-index-box" v-if="targetDailyInstance.aqi">
        <div style="font-size: small">AQI</div>
        <div style="display: flex; align-items: center; gap: 4px">
          <div>{{ targetDailyInstance.aqi!.avg.chn }}</div>
          <AQIBadge :aqi="targetDailyInstance.aqi!.avg.chn"/>
        </div>
      </div>
      <div class="detail-index-box" v-if="targetDailyInstance.pm25">
        <div style="font-size: small; display: flex; align-items: baseline">
          <span>PM</span>
          <span style="transform-origin: left bottom; transform: scale(0.7)">25</span>
        </div>
        <div>{{ targetDailyInstance.pm25!.avg }}</div>
      </div>
    </div>
    <div class="detail-index-box">
      <div style="font-size: small">气压</div>
      <div>{{ targetDailyInstance.pressure?.avg }}</div>
    </div>
  </TipCard>

</template>

<style scoped>

.detail-block {
  height: 100%;
}

.detail-index-box {
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-block:hover {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0) 100%);
}

</style>