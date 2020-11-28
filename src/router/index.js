import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import Home from '../components/Home.vue'
import { render } from 'less'

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
//挂载路由导航守卫，如果用户没有登录，但是直接通过URL访问特定页面，需要重新导航到登录页面
router.beforeEach((to,from,next)=>{
  //to表示要访问的路径 from表示从哪个路径跳转而来 next()表示放行  next('/login')表示强制跳转
  if(to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()

})
export default router
