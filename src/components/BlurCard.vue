<script setup lang="ts">

const props = defineProps<{
  realtimeWeatherBackground: string,
  infoSize: 'info-size-1' | 'info-size-2'
}>();

</script>

<template>
  <el-card
      style="padding: 0"
      :body-style="{padding: '0', overflow: 'hidden', position: 'relative'}"
      shadow="hover"
  >
    <div class="masking"/>

    <div :class="props.infoSize">
      <slot/>
    </div>
  </el-card>
</template>

<style scoped>

.masking {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  z-index: -1;
  transition: all 0.2s;
}

</style>