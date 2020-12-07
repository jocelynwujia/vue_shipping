import Vue from 'vue'
import {
    Button,
    Form,
    FormItem, 
    Input, 
    Message, 
    Container, 
    Header, 
    Aside, 
    main, 
    Main, 
    Menu, 
    Submenu, 
    MenuItem, 
    MenuItemGroup,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
<<<<<<< HEAD
    Alert,
    Cascader,
    Tabs,
    TabPane,
    Steps,
    Step,
    CheckboxGroup,
    Checkbox,
    Upload,
    Timeline,
    TimelineItem

=======
    Cascader
>>>>>>> 20.商品分类
} from 'element-ui'

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
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
<<<<<<< HEAD
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)

=======
Vue.use(Cascader)
>>>>>>> 20.商品分类

//把弹框注册为全局组件
Vue.prototype.$message = Message
// 把弹框询问注册为全局组件
Vue.prototype.$confirm = MessageBox.confirm

