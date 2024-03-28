import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";// 持久化插件

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(ElementPlus);
app.use(pinia);
app.mount('#app');
