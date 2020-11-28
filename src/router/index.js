import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  // 组件重定向
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/home', component: Home },
]

const router = new VueRouter({
  routes
})

export default router
