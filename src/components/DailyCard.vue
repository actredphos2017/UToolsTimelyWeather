<script setup lang="ts">

import {DailyData} from "../models/caiyunapi/daily.ts";
import {computed, ref, watch} from "vue";
import {getDailyInstance} from "../utils/utils.ts";
import {definePositionMapper} from "../utils/canvas_utils.ts";
import {dailyIcon} from "../utils/icons.ts";

const props = defineProps<{
  dailyData: DailyData
}>();

const dailyInstances = computed(() => getDailyInstance(props.dailyData));

const graph = ref<HTMLCanvasElement>();

const detailEachWidth = ref(0);

watch([dailyInstances, graph], updateGraph, {immediate: true});

function updateGraph() {
  if (!graph.value) return;
  let ctx = graph.value.getContext('2d');
  if (!ctx) return;

  const virtualSize = 1000;

  const defaultMapper = definePositionMapper(graph.value, virtualSize);

  const maxTemperatures = dailyInstances.value.map(e => e.temperature?.max ?? 0);
  const minTemperatures = dailyInstances.value.map(e => e.temperature?.min ?? 0);

  const maxTemperature = Math.max(...maxTemperatures);
  const minTemperature = Math.min(...minTemperatures);

  const eachWidth = virtualSize / dailyInstances.value.length;
  detailEachWidth.value = defaultMapper(eachWidth, 0)[0];

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
  const graphMapper = definePositionMapper(
      graph.value!,
      virtualSize,
      0,
      0,
      70,
      70
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
  ctx.strokeStyle = 'blue';
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
  ctx.strokeStyle = 'blue';
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
  maxPoints.forEach(p => {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#00f';
    ctx.beginPath();
    ctx.arc(p.position[0], p.position[1], 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  });
  minPoints.forEach(p => {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#00f';
    ctx.beginPath();
    ctx.arc(p.position[0], p.position[1], 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  });
  ctx.save();
}

</script>

<template>
  <div style="height: 40px; display: flex; gap: 4px; align-items: center; padding-left: 12px">
    <el-icon v-html="dailyIcon.template" size="32px"/>
    <span class="main-black-text" style="font-size: large">
      每日天气
    </span>
  </div>
  <div style="height: 210px">
    <el-scrollbar>
      <div style="width: 1200px; height: 200px; position: relative">
        <canvas style="position: absolute" ref="graph" width="1200" height="200"/>
        <div style="display: flex; width: 1200px; height: 200px;">
          <el-popover
            v-for="dailyInstance in dailyInstances"
            :key="dailyInstance.date.getTime()"
          >
            <template #reference>
              <div
                  class="detail-block"
                  style="z-index: 10"
                  :style="{width: `${detailEachWidth}px`}"
              >

              </div>
            </template>
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