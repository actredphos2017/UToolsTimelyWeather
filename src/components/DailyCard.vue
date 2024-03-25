<script setup lang="ts">

import {DailyData} from "../models/caiyunapi/daily.ts";

const props = defineProps<{
  dailyData: DailyData
}>();

</script>

<template>
  {{ props.dailyData }}
</template>

<style scoped>

</style>