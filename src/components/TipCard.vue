<script setup lang="ts">

import {computed, onMounted, onUnmounted, ref, StyleValue} from "vue";

const topPos = ref(0);
const leftPos = ref(0);

const cardInstance = ref<HTMLDivElement>();

const cardStyle = computed<StyleValue>(() => ({
  position: 'fixed',
  top: topPos.value + 'px',
  left: leftPos.value + 'px',
  padding: '12px',
  backgroundColor: 'rgba(255,255,255,0.8)',
  borderRadius: '12px',
  zIndex: '100'
}));

const updatePosition = (e: MouseEvent) => {
  leftPos.value = e.clientX + 12;
  topPos.value = e.clientY + 12;
  if (cardInstance.value) {
    const rect = cardInstance.value.getBoundingClientRect();
    if (leftPos.value + rect.width > window.innerWidth && e.clientX - 12 - rect.width >= 0) {
      leftPos.value = e.clientX - 12 - rect.width;
    }
    if (topPos.value + rect.height > window.innerHeight && e.clientY - 12 - rect.height >= 0) {
      topPos.value = e.clientY - 12 - rect.height;
    }
  }
}

onMounted(() => {
  window.addEventListener('mousemove', updatePosition);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', updatePosition);
});

</script>

<template>
  <div :style="cardStyle" ref="cardInstance">
    <slot/>
  </div>
</template>

<style scoped>

</style>