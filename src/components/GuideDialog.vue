<script setup lang="ts">

import {EditPen, Guide} from "@element-plus/icons-vue";
import {useLocationListStore, useSettingStore} from "../plugins/store.ts";
import {computed} from "vue";
import {ElMessage} from "element-plus";

const displayGuideDialog = defineModel({
  default: false
});

const props = withDefaults(defineProps<{
  onSetToken: () => void,
  onSetLocations: () => void,
  onFinish: () => void
}>(), {
  onSetToken: () => {
  },
  onSetLocations: () => {
  },
  onFinish: () => {
  },
});

const settings = useSettingStore();
const locationList = useLocationListStore();

const caiyunToken = computed(() => settings.caiyunToken);
const tokenGood = computed(() => !(/^\s*$/.test(settings.caiyunToken)));

const locationCount = computed(() => locationList.userLocations.length);

const allDone = computed(() => locationCount.value > 0 && tokenGood.value);

function handleClose(done: () => void) {
  if (allDone.value) {
    done();
    props.onFinish();
  } else {
    ElMessage.error('请完成所有必要的向导设置')
  }
}

function handleDone() {
  displayGuideDialog.value = false;
  props.onFinish();
}

</script>

<template>

  <el-dialog
      v-model="displayGuideDialog"
      :show-close="false"
      :before-close="handleClose"
  >
    <template #header>
      <div style="display: flex; align-items: center; gap: 4px">
        <el-icon>
          <Guide/>
        </el-icon>
        <div>
          初始化设置向导
        </div>
      </div>
    </template>

    <table>
      <tr>
        <td style="font-weight: bold">
          彩云 TOKEN
        </td>
        <td style="padding-left: 20px">
          <div v-if="tokenGood" style="color: #67c23a">
            {{ caiyunToken }}
          </div>
          <div v-else style="color: #c45656">
            未设置
          </div>
        </td>
        <td style="padding-left: 20px">
          <el-button type="text" @click="props.onSetToken">
            <el-icon>
              <EditPen/>
            </el-icon>
          </el-button>
        </td>
      </tr>
      <tr>
        <td style="font-weight: bold">
          位置信息
        </td>
        <td style="padding-left: 20px">
          <div v-if="locationCount > 0" style="color: #67c23a">
            已添加 {{ locationCount }} 个位置
          </div>
          <div v-else style="color: #c45656">
            未设置
          </div>
        </td>
        <td style="padding-left: 20px">
          <el-button type="text" @click="props.onSetLocations()">
            <el-icon>
              <EditPen/>
            </el-icon>
          </el-button>
        </td>
      </tr>
    </table>
    <template #footer>
      <el-button type="primary" :disabled="!allDone" @click="handleDone">
        完成
      </el-button>
    </template>
  </el-dialog>

</template>

<style scoped>

</style>