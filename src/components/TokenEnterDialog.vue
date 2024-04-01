<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useSettingStore} from "../plugins/store.ts";
import {QuestionFilled} from "@element-plus/icons-vue";
import {ElMessageBox} from "element-plus";

const displayTokenEnterDialog = defineModel({
  default: false
});

const caiyunToken = ref('');

onMounted(() => {
  caiyunToken.value = useSettingStore().caiyunToken
});

function setToken() {
  useSettingStore().caiyunToken = caiyunToken.value;
  useSettingStore().usePublicToken = false;
  displayTokenEnterDialog.value = false;
}

function usePublicToken() {
  ElMessageBox.confirm(`
  <div>
    <div>所谓公共 Token 只不过也是卑微作者自己申请的个人 Token。</div>
    <div>因为是个人 Token ，所以彩云官方也会有响应频率的限制。</div>
    <div>使用的人多了，可能会存在刷新失败的情况。</div>
    <div>如果你使用公共 Token ，暂时会有以下限制</div>
    <ol>
      <li style="font-weight: bold">每个地区天气每 15 分钟只能刷新一次</li>
      <li style="font-weight: bold">每小时至多只能刷新 5 次（刷新失败不算）</li>
    </ol>
    <div>如果不嫌麻烦，还是建议自己去申请一个 Token ！</div>
    <div>(>_<)!!!</div>
  </div>`, '使用公共 Token', {
    confirmButtonText: '我偏要用！',
    cancelButtonText: '我不用了',
    dangerouslyUseHTMLString: true
  })
      .then(() => {
        useSettingStore().usePublicToken = true;
        displayTokenEnterDialog.value = false;
      })
      .catch();

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
          请前往 platform.caiyunapp.com <a href="https://platform.caiyunapp.com" class="styled-a-tag">彩云开放平台</a>
          根据指引获取调用 TOKEN
        </div>
      </div>
      <div style="width: 100%; display: flex; justify-content: right; align-items: center; gap: 12px">
        <el-button @click="usePublicToken">
          使用公共 Token
        </el-button>
        <el-button type="primary" @click="setToken">
          确认
        </el-button>
      </div>

    </div>
  </el-dialog>
</template>

<style scoped>

</style>