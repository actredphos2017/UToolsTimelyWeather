<script setup lang="ts">

import {computed, onMounted, onUnmounted, ref, StyleValue, watch} from "vue";

const props = defineProps<{
  realtimeWeatherBackground: string,
  infoSize: 'info-size-1' | 'info-size-2'
}>();

const realtimeWeatherBackground = computed(() => props.realtimeWeatherBackground);
const infoSize = computed(() => props.infoSize);

const fixBlurBackgroundStyle = computed<StyleValue>(() => {
  return {
    backgroundImage: `url('${realtimeWeatherBackground.value}')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    top: fixedTop.value + 'px',
    left: fixedLeft.value + 'px',
    width: windowWidth.value + 'px',
    height: windowHeight.value + 'px',
    position: 'absolute',
    filter: 'blur(24px)',
    zIndex: '-2'
  } as StyleValue
});

const fixedElement = ref<HTMLDivElement>();
const fixedTop = ref(0);
const fixedLeft = ref(0);
const windowWidth = ref(0);
const windowHeight = ref(0);

const scrollHandler = () => {
  const rect = fixedElement.value?.getBoundingClientRect();
  fixedTop.value = 0 - (rect?.top ?? 0);
  fixedLeft.value = 0 - (rect?.left ?? 0);
}

const resizeHandler = () => {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
}

watch(fixedElement, scrollHandler, {immediate: true});

onMounted(() => {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
  window.addEventListener('scroll', scrollHandler);
  window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler);
  window.removeEventListener('resize', resizeHandler);
});

</script>

<template>
  <el-card
      style="padding: 0"
      :body-style="{padding: '0', overflow: 'hidden', position: 'relative'}"
      shadow="hover"
  >
    <div ref="fixedElement" style="position: absolute; width: 100%; height: 100%">
      <div :style="fixBlurBackgroundStyle"/>
    </div>
    <div class="masking"/>

    <div :class="infoSize">
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
  z-index: -1;
  transition: all 0.2s;
}

</style>