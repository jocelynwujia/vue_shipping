import Vue from 'vue'
import VueRouter from 'vue-router'

// import login from '../components/login.vue'
const login = () => import(/* webpackChunkName: "login_Home_Welcome" */ '../components/login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_Home_Welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_Home_Welcome" */ '../components/Welcome.vue')

// import Users from '../components/users/Users.vue'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles */ '../components/users/Users.vue')
// import Rights from '../components/Power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles */ '../components/Power/Rights.vue')
// import Roles from '../components/Power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles */ '../components/Power/Roles.vue')

// import Cate from '../components/goods/cate.vue'
const Cate  = () => import(/* webpackChunkName: "Cate_Params */ '../components/goods/cate.vue')
// import Params from '../components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "Cate_Params */ '../components/goods/Params.vue')

// import list from '../components/goods/list.vue'
const list = () => import(/* webpackChunkName: "list_Add */ '../components/goods/list.vue')
// import Add from '../components/goods/Add.vue'
const Add = () => import(/* webpackChunkName: "list_Add */ '../components/goods/Add.vue')

// import Order from '../components/orders/Order.vue'
const Order = () => import(/* webpackChunkName: "Order_report */ '../components/orders/Order.vue')
// import report from '../components/report/report.vue'
const report = () => import(/* webpackChunkName: "Order_report */ '../components/report/report.vue')

Vue.use(VueRouter)

const routes = [
  // 组件重定向
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home', 
    component: Home, 
    redirect:'/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: list },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: report }
    ]
  },
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫，如果用户没有登录，但是直接通过URL访问特定页面，需要重新导航到登录页面
router.beforeEach((to, from, next) => {
  //to表示要访问的路径 from表示从哪个路径跳转而来 next()表示放行  next('/login')表示强制跳转
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()

})
export default router
