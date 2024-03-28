<script setup lang="ts">

import {Search} from "@element-plus/icons-vue";
import {ref} from "vue";
import {CityCenter, searchCitiesByName} from "../models/city_center.ts";
import {ElMessage} from "element-plus";
import {useLocationListStore} from "../plugins/store.ts";

const displayAddCityDialog = defineModel({
  default: false
});

const citySearchKey = ref('');

const searching = ref(false);
const searchResult = ref<undefined | CityCenter[]>()

function startSearch() {
  searching.value = true;
  searchCitiesByName(citySearchKey.value)
      .then(res => {
        console.log(res);
        searchResult.value = res;
      })
      .catch(e => {
        ElMessage.error(e);
      })
      .finally(() => {
        searching.value = false;
      });
}

const locationState = useLocationListStore();

function addCity(city: CityCenter) {
  locationState.pushCityCenter(city);
  displayAddCityDialog.value = false;
}

</script>

<template>
  <el-dialog
      v-model="displayAddCityDialog"
      :show-close="false"
      style="z-index: 10"
  >
    <template #header>
      <el-input
          v-model="citySearchKey"
          placeholder="城市名称或城市ID"
          @keyup.enter="startSearch"
          :disabled="searching"
          v-loading="searching"
      >
        <template #prefix>
          <el-icon>
            <Search/>
          </el-icon>
        </template>
      </el-input>
    </template>
    <div v-if="searchResult == undefined">
      请输入搜索内容
    </div>
    <div v-else-if="searchResult.length == 0" style="display: flex; justify-content: center">
      目标城市不存在
    </div>
    <el-scrollbar max-height="400px" v-else style="display: flex; flex-direction: column">
      <el-card v-for="city in searchResult" style="margin: 8px 8px; cursor: pointer;" @click="addCity(city)">
        <div style="display: flex; width: 100%; justify-content: space-between; align-items: center">
          <div style="display: flex; width: 100%; gap: 4px">
            <div style="font-weight: bold">{{ city.province }}</div>
            <div style="font-weight: bold">{{ city.city }}</div>
            <div style="font-weight: bold">{{ city.district }}</div>
          </div>
          <div style="display: flex; flex-direction: column">
            <div style="display: flex; gap: 4px">
              <div>经</div>
              <div>{{ city.longitude }}</div>
            </div>
            <div style="display: flex; gap: 4px">
              <div>纬</div>
              <div>{{ city.latitude }}</div>
            </div>
          </div>
        </div>

      </el-card>
    </el-scrollbar>
  </el-dialog>
</template>

<style scoped>

</style>