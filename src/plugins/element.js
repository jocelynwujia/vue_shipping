import Vue from 'vue'
import { Button,Form, FormItem,Input,Message,Container,Header,Aside,main, Main,Menu,Submenu,MenuItem,MenuItemGroup} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
//把弹框注册为全局组件
Vue.prototype.$message = Message
