<script setup lang="ts">

import {cityIcon} from "../utils/icons.ts";
import {useLocationListStore} from "../plugins/store.ts";
import {computed} from "vue";
import {
  AddLocation,
  Delete,
  Refresh, Setting,
  Star,
  StarFilled
} from "@element-plus/icons-vue";

const props = withDefaults(defineProps<{
  onSwitchToCity: (index: number) => void,
  onRefresh: () => void,
  onAddCity: () => void,
  onSetting: () => void
}>(), {
  onSwitchToCity() {
  },
  onRefresh() {
  },
  onAddCity() {
  },
  onSetting() {
  },
});

const locationState = useLocationListStore();

const cities = computed(() => locationState.userLocations);

const favoriteIndex = computed(() => locationState.favoriteIndex);

function setFavorite(index: number) {
  locationState.setFavoriteIndex(index);
}

function removeCity(index: number) {
  locationState.removeLocationAtIndex(index);
}

</script>

<template>
  <div class="top-bar-container">
    <el-popover
        width="320px"
        trigger="click"
    >
      <template #reference>
        <el-button type="text" style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
          <el-icon v-html="cityIcon.template"/>
          <div>
            城市列表
          </div>
        </el-button>
      </template>
      <div style="display: flex; flex-direction: column; gap: 12px">
        <div style="display: flex; justify-content: right; align-items: center">
          <el-button round type="primary" @click.stop="props.onAddCity">
            <template #icon>
              <el-icon>
                <AddLocation/>
              </el-icon>
            </template>
            添加城市
          </el-button>
        </div>
        <el-scrollbar max-height="400px" style="display: flex; flex-direction: column">
          <el-card
              v-for="city in cities.map((value, index) => ({value, index}))"
              @click="props.onSwitchToCity(city.index)"
              type="text"
              style="margin: 8px; cursor: pointer"
              shadow="hover"
          >
            <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
              <div>
                {{ city.value.name }}
              </div>
              <div>
                <el-button circle type="warning" plain @click.stop="setFavorite(city.index)">
                  <el-icon>
                    <StarFilled v-if="city.index == favoriteIndex"/>
                    <Star v-else/>
                  </el-icon>
                </el-button>
                <el-popconfirm
                    trigger="click"
                    placement="right"
                    title="确认删除城市？"
                    @confirm="removeCity(city.index)"
                >
                  <template #reference>
                    <el-button circle type="danger" plain @click.stop>
                      <el-icon>
                        <Delete/>
                      </el-icon>
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>

            </div>
          </el-card>
        </el-scrollbar>
      </div>
    </el-popover>
    <div>
      <el-button circle type="text" @click="props.onRefresh">
        <el-icon>
          <Refresh/>
        </el-icon>
      </el-button>
      <el-button circle type="text" @click="props.onSetting">
        <el-icon>
          <Setting/>
        </el-icon>
      </el-button>
    </div>
  </div>


</template>

<style scoped>

.top-bar-container {
  width: calc(100% - 40px);
  padding: 0 20px;
  height: 32px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between
}

</style>