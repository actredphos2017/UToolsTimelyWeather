<script setup lang="ts">

import {AlertContent} from "../models/caiyunapi/alert.ts";
import {computed} from "vue";
import {Warning} from "@element-plus/icons-vue";
import {formatDate} from "../utils/utils.ts";

const props = defineProps<{
  alertContent: AlertContent
}>();

const alertContent = computed(() => props.alertContent);

</script>

<template>
  <el-popover
      width="400px"
  >
    <template #reference>
      <div class="alert-card-container">
        <div style="display: flex; align-items: center; justify-content: space-between">
          <div style="display: flex; gap: 4px; align-items: center;">
            <el-icon color="white">
              <Warning/>
            </el-icon>
            <div class="main-white-text">
              预警信息
            </div>
          </div>
          <div>
            <div class="main-white-text" style="font-size: small">
              {{ formatDate(alertContent.pubtimestamp) }}
            </div>
          </div>
        </div>
        <span class="secondary-white-text" style="font-size: smaller">
          {{ alertContent.title }}
        </span>
      </div>
    </template>
    <div>
      {{ alertContent.description }}
    </div>
  </el-popover>
</template>

<style scoped>

.alert-card-container {
  width: 200px;
  background: rgba(255, 106, 0, 0.5);
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.6) 0 0 4px;
  padding: 6px 12px;
  transition: all 0.2s;
}
.alert-card-container:hover {
  box-shadow: rgba(0, 0, 0, 0.6) 0 0 8px;
}

</style>