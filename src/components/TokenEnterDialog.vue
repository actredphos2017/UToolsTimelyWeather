<script setup lang="ts">

import {ref} from "vue";
import {useSettingStore} from "../plugins/store.ts";

const displayTokenEnterDialog = defineModel({
  default: false
});

const caiyunToken = ref('');

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
        请输入 彩云 API TOKEN
      </div>
    </template>
    <el-input v-model="caiyunToken" @keydown.enter="setToken">

    </el-input>
    <el-button @click="setToken">
      确认
    </el-button>
  </el-dialog>
</template>

<style scoped>

</style>