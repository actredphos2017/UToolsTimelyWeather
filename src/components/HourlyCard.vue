<script setup lang="ts">

import {HourlyData} from "../models/caiyunapi/hourly.ts";
import {computed, ref, watch} from "vue";
import {definePositionMapper} from "../utils/canvas_utils.ts";
import {getHourlyInstances, getTimeRoundToMinuteString} from "../utils/utils.ts";
import {hourlyIcon} from "../utils/icons.ts";
import {parseWeatherIcon, parseWeatherName} from "../utils/resource_parser.ts";
import {InfoFilled} from "@element-plus/icons-vue";
import AQIBadge from "./AQIBadge.vue";

const props = defineProps<{
  hourlyData: HourlyData
}>();

const hourlyInstances = computed(() => getHourlyInstances(props.hourlyData));

const graph = ref<HTMLCanvasElement>();

const detailEachWidth = ref(0);

watch([graph, hourlyInstances], updateGraph, {immediate: true});

function updateGraph() {
  if (!graph.value) return;
  let ctx = graph.value.getContext('2d');
  if (!ctx) return;

  const virtualSize = 1000;
  const defaultLineMapper = definePositionMapper(graph.value, virtualSize);

  const temperatures = hourlyInstances.value.map(e => e.temperature);
  const maxTemperature = Math.max(...temperatures.map(e => (e ?? 0)));
  const minTemperature = Math.min(...temperatures.map(e => (e ?? 0)));
  const eachWidth = virtualSize / hourlyInstances.value.length;
  detailEachWidth.value = defaultLineMapper(eachWidth, 0)[0];

  // 画分割线
  const [divisionLineGradientStartX, divisionLineGradientStartY] = defaultLineMapper(0, 0);
  const [divisionLineGradientEndX, divisionLineGradientEndY] = defaultLineMapper(0, virtualSize);
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
  for (let i = 1; i < hourlyInstances.value.length; i++) {
    const x = eachWidth * i;
    const [startX, startY] = defaultLineMapper(x, virtualSize);
    const [endX, endY] = defaultLineMapper(x, 0);
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
  }
  ctx.stroke();
  ctx.save();

  // 温度折线图点位
  const graphMapper = definePositionMapper(graph.value!, virtualSize, 0, 0, 100, 50);
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
  ctx.strokeStyle = 'blue';
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
  points.forEach(p => {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#00f';
    ctx.beginPath();
    ctx.arc(p.position[0], p.position[1], 3, 0, Math.PI * 2);
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
    ctx.font = '13px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.fillText(p.temperatureText, 6, -5);
    ctx.restore();
  });
}

</script>

<template>
  <div style="height: 40px; display: flex; gap: 4px; align-items: center; padding-left: 12px">
    <el-icon v-html="hourlyIcon.template" size="32px"/>
    <span class="main-black-text" style="font-size: large">
      小时天气
    </span>
  </div>
  <div style="height: 210px;">
    <el-scrollbar>
      <div style="width: 1600px; height: 200px; position: relative;">
        <canvas ref="graph" width="1600" height="200" style="position: absolute;"/>
        <div style="display: flex; width: 1600px; height: 200px;">
          <el-popover
              v-for="hourlyInstance in hourlyInstances"
              :key="hourlyInstance.date.getTime()"
              placement="bottom"
              width="300px"
          >
            <template #reference>
              <div
                  class="detail-block"
                  style="z-index: 10; display: flex; flex-direction: column; justify-content: space-between"
                  :style="{width: `${detailEachWidth}px`}"
              >
                <div v-if="hourlyInstance.skycon" style="width: 100%; display: flex; align-items: center; flex-direction: column; gap: 4px">
                  <img :src="parseWeatherIcon(hourlyInstance.skycon)" style="width: 32px" alt="天气图标" />
                  <span class="secondary-black-text" style="font-size: small; font-weight: bold">
                    {{ parseWeatherName(hourlyInstance.skycon) }}
                  </span>
                </div>
                <div class="secondary-black-text" style="width: 100%; text-align: center; padding-bottom: 16px; font-size: medium">
                  {{ getTimeRoundToMinuteString(hourlyInstance.date) }}
                </div>
              </div>
            </template>
            <div style="width: 100%; display: flex; flex-direction: column">
              <div style="display: flex; align-items: center; gap: 4px">
                <el-icon>
                  <InfoFilled/>
                </el-icon>
                <div>
                  {{ hourlyInstance.date.toLocaleString() }}
                </div>
              </div>
              <div style="font-size: large">
                {{ hourlyInstance.temperature }}℃
              </div>
              <div style="font-size: medium">
                体感 {{ hourlyInstance.apparent_temperature }}℃
              </div>
              <div v-if="hourlyInstance.skycon" style="font-size: medium; display: flex; align-items: center; gap: 4px">
                <span>{{ parseWeatherName(hourlyInstance.skycon) }}</span>
                <img :src="parseWeatherIcon(hourlyInstance.skycon)" style="width: 32px" alt="天气图标" />
                <div v-if="hourlyInstance.precipitation && hourlyInstance.precipitation.probability > 0" style="display: flex; flex-direction: column; font-size: small; color: #66aaf3">
                  <span>{{ hourlyInstance.precipitation.probability }}%</span>
                  <span>{{ hourlyInstance.precipitation.value }}mm</span>
                </div>
              </div>
              <div v-if="hourlyInstance.aqi" style="display: flex; align-items: center; gap: 4px">
                <span>空气污染指数 {{ hourlyInstance.aqi.chn }}</span>
                <AQIBadge :aqi="hourlyInstance.aqi.chn" />
              </div>
              <div>
                PM2.5 {{ hourlyInstance.pm25 }}
              </div>
              <div>
                能见度 {{ hourlyInstance.visibility }}
              </div>
              <div>
                气压 {{ hourlyInstance.pressure }}
              </div>
              <div>
                相对湿度 {{ hourlyInstance.humidity }}
              </div>
              <div>
                云量 {{ hourlyInstance.cloudrate }}
              </div>
              <div>
                向下短波辐射通量 {{ hourlyInstance.dswrf }}W/M2
              </div>

            </div>
          </el-popover>
        </div>
      </div>
    </el-scrollbar>
  </div>

</template>

<style scoped>

.detail-block {
  height: 100%;
}

.detail-block:hover {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0) 100%);
}

</style>