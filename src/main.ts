import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

createApp(App)
    .use(ElementPlus)
    .mount('#app')
