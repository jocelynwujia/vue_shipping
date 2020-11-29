import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入axios
import axios from 'axios'



// 配置请求axios的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通过axios拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
