<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useSettingStore} from "../plugins/store.ts";
import {QuestionFilled} from "@element-plus/icons-vue";

const displayTokenEnterDialog = defineModel({
  default: false
});

const caiyunToken = ref('');

onMounted(() => {
  caiyunToken.value = useSettingStore().caiyunToken
});

function setToken() {
  useSettingStore().caiyunToken = caiyunToken.value;
  displayTokenEnterDialog.value = false;
}

</script>

<template>
  <el-dialog
      v-model="displayTokenEnterDialog"
      :show-close="false"
      style="z-index: 10"
  >
    <template #header>
      <div style="width: 100%; display: flex; justify-content: center; align-items: center">
        天气数据源配置
      </div>
    </template>
    <div style="width: 100%; display: flex; flex-direction: column; gap: 4px; align-items: center">
      <el-input v-model="caiyunToken" @keydown.enter="setToken" placeholder="彩云开放平台 天气 API 调用 TOKEN"/>
      <div style="display: flex; align-items: center; gap: 4px; align-self: start">
        <el-icon>
          <QuestionFilled/>
        </el-icon>
        <div style="font-size: small">
          请前往 platform.caiyunapp.com <a href="https://platform.caiyunapp.com" class="styled-a-tag">彩云开放平台</a> 根据指引获取调用 TOKEN
        </div>
      </div>
      <el-button @click="setToken" style="align-self: end">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<style scoped>

</style>