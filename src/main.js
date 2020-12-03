import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入axios
import axios from 'axios'
import TableTree from 'vue-table-with-tree-grid'


// 配置请求axios的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通过axios拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 注册全局可用的组件
Vue.component('tree-table', TableTree)
// 自定义格式化时间的全局过滤器
Vue.filter('dateformat', function (originVal) {
  const dt = new Date()
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1).toString().padStart(2, '0')
  const d = dt.getDate().toString().padStart(2, '0')

  const hh = dt.getHours().toString().padStart(2, '0')
  const ff = dt.getMinutes().toString().padStart(2, '0')
  const mm = dt.getSeconds().toString().padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${ff}:${mm}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
