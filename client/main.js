import App from './App'
//import store from './store/index.js'   //根据自己weapp.socket.io.js文件的路径来写
//Vue.prototype.socket=io('http://192.168.31.135:9090')
// #ifndef VUE3
import Vue from 'vue'
// uViewUI
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
// 引入配置文件
import $config from "@/utils/lib/config.js"
Vue.prototype.$config = $config
// 引入助手函数
import $tool from '@/utils/lib/tool.js'
Vue.prototype.$tool = $tool

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	//store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif