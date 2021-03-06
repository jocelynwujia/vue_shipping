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
// 导入富文本
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入Nprogress 中js和css的文件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import { config } from 'vue/types/umd'


// 配置请求axios的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通过axios拦截器添加token，保证拥有获取数据的权限
// 在request拦截器中 展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 在response 拦截器中 隐藏进度条 NProgress.done()
axios.interceptors.response.use(config=>{
  NProgress.done()
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

// 将富文本注册为全局组件
Vue.use(VueQuillEditor, /* { default global options } */)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
