<script setup lang="ts">

import {computed, ref, watch} from "vue";
import {MinutelyData} from "../models/caiyunapi/minutely.ts";
import {getPrecipitationStrengthRectangles} from "../utils/precipitation_utils.ts";
import {precipitationIcon} from "../utils/icons.ts";
import {Aim} from "@element-plus/icons-vue";

const props = defineProps<{
  minutelyData: MinutelyData
}>();

const minutelyData = computed(() => props.minutelyData);

const graph = ref<HTMLCanvasElement>();

watch([
  minutelyData,
  graph
], updateGraph, {immediate: true});

function updateGraph() {

  if (!graph.value) return;
  const ctx = graph.value.getContext('2d');
  if (!ctx) return;

  const dataSet = props.minutelyData.precipitation_2h;

  const fullWidth = graph.value.width;
  const fullHeight = graph.value.height;

  const paddingLeft = 0;
  const paddingRight = 0;
  const paddingTop = 10;
  const paddingBottom = 10;

  const virtualSize = 1000;

  const spacingX = virtualSize / (dataSet.length - 1);
  const maxPrecipitation = Math.max(...dataSet);

  const positionMapper = (
      pX: number,
      pY: number,
      pl = paddingLeft,
      pr = paddingRight,
      pt = paddingTop,
      pb = paddingBottom
  ) => {
    return [
      pl + (fullWidth - pl - pr) * (pX / virtualSize),
      fullHeight - pb - (fullHeight - pt - pb) * (pY / virtualSize)
    ];
  };

  // 绘制降水强度参考框
  // getPrecipitationStrengthRectangles(maxPrecipitation, virtualSize).forEach(rect => {
  //   const [ltx, lty] = positionMapper(0, rect.toY);
  //   const [rtx, rty] = positionMapper(1000, rect.toY);
  //   const [rbx, rby] = positionMapper(1000, rect.fromY);
  //   const [lbx, lby] = positionMapper(0, rect.fromY);
  //   ctx.moveTo(ltx, lty);
  //   ctx.lineTo(rtx, rty);
  //   ctx.lineTo(rbx, rby);
  //   ctx.lineTo(lbx, lby);
  //   ctx.fillStyle = rect.color;
  //   ctx.fill();
  // });

  // 绘制降水图
  dataSet.forEach((value, index) => {
    const [x, y] = positionMapper(
        index * spacingX,
        (value / maxPrecipitation) * virtualSize
    );
    console.log(x, y)
    if (index == 0) {
      ctx.moveTo(x, y);
      ctx.beginPath();
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.strokeStyle = 'blue';
  ctx.stroke();

  const [rightBottomX, rightBottomY] = positionMapper(virtualSize, 0);
  const [leftBottomX, leftBottomY] = positionMapper(0, 0);
  const [leftTopX, leftTopY] = positionMapper(0, virtualSize);

  ctx.lineTo(rightBottomX, rightBottomY);
  ctx.lineTo(leftBottomX, leftBottomY);
  ctx.closePath();

  const gradient = ctx.createLinearGradient(leftTopX, leftTopY, leftBottomX, leftBottomY);
  gradient.addColorStop(0, 'rgba(0,129,255,0.5)');
  gradient.addColorStop(1, 'rgba(0,129,255,0)');

  ctx.fillStyle = gradient;
  ctx.fill();
}

</script>

<template>
  <div class="precipitation-card-container">
    <div style="display: flex; gap: 4px; align-items: center">
      <el-icon color="white" v-html="precipitationIcon.template"/>
      <div class="main-white-text">
        降雨信息
      </div>
    </div>
    <el-scrollbar
        aria-orientation="horizontal"
        style="width: 100%; height: fit-content"
    >
      <canvas ref="graph" width="1600" height="100"/>
    </el-scrollbar>
    <div class="secondary-white-text" style="font-size: small">
      <el-icon color="white">
        <Aim/>
      </el-icon>
      {{ minutelyData.description }}
    </div>
  </div>
</template>

<style scoped>

.precipitation-card-container {
  width: 200px;
  background: rgba(33, 71, 166, 0.8);
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.4) 0 0 4px;
  padding: 6px 12px;
  transition: all 0.2s;
}
.precipitation-card-container:hover {
  box-shadow: rgba(0, 0, 0, 0.6) 0 0 8px;
}

</style>