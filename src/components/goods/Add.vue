<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示区-->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        :closable="false"
      ></el-alert>
      <!-- 进度条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave = "beforeTabLeave" @tab-click = "tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" type="number">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props= "cateProps"
                @change="handleChange"></el-cascader>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1" > 
              <!-- 渲染表单的Item项 -->
              <el-form-item :label="item.attr_name" v-model="manyTabData" v-for="item in manyTabData" :key="item.attr_id">
                  <!-- 多选复选框 -->
                  <el-checkbox-group v-model="item.attr_vals">
                     <el-checkbox :label="cb" v-for = "(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                  </el-checkbox-group>
              </el-form-item>
         </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item  :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
              <!-- action 图片要上传到的后台的api地址 -->
              <el-upload
                :action="uploadURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture" 
                :headers="headerObj"
                :on-success = "handleUploadSuccess">
                <el-button size="small" type="primary">点击上传</el-button>
             </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
              <!-- 富文本区域 -->
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <!-- 添加商品按钮 -->
              <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>


    <!-- 图片预览 -->
    <el-dialog
    title="图片预览"
    :visible.sync="previewDialogVisible"
    width="50%">
    <img :src="previewPath" alt="" class="previewImg">
</el-dialog>
  </div>
</template>

<script>
// 导入lodash
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: "0",
      // 添加商品列表
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number:0,
        // 商品所属的分类数组
        goods_cat:[],
        //  图片上传的路径数组
        pics:[],
        attrs:[]
      },
    //   表单校验规则
      addFormRules: {
        goods_name: [
          {
            required: true,
            messaage: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            messaage: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            messaage: "请输入商品重量",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            messaage: "请输入商品重量",
            trigger: "blur",
          },
        ],
      },
      // 商品分类数组
      catelist:[],
    //   级联选择器的配置对象
      cateProps:{
        //   表示我们看到的是哪个属性
          label:'cat_name',
        //   表示选中的谁的值
          value:'cat_id',
        //   表示哪个属性实现父子节点的嵌套
          children:'children',
          expandTrigger: 'hover'
      },
    //   动态参数列表数据
      manyTabData:[],
    //   静态属性列表数据
      onlyTabData:[],
    //上传图片的URL地址
     uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
    //  图片上传组件的header请求头对象
     headerObj:{
         Authorization:window.sessionStorage.getItem('token')
     },
    //  控制图片预览的显示与隐藏
    previewDialogVisible:false,
    // 图片预览的路径
    previewPath:''
    
    };
  },
  created(){
      this.getCateList()
  },
  
  methods:{
    //   获取商品列表
    async getCateList(){
        const {data:res} = await this.$http.get('categories')
        // console.log(res)
        if(res.meta.status !== 200){
            return this.$message.error('商品列表获取失败！')
        }
            this.catelist = res.data
            // console.log(this.catelist)
    },
    // 级联选择器选择项发生变化时，会触发该函数
    handleChange(){
        // console.log(this.addForm.goods_cat)
        // 控制级联选择器的选择范围
        if(this.addForm.goods_cat.length !==3 ){
            // 清空选择项
            this.addForm.goods_cat = []
        }
    },
    beforeTabLeave(activeName,oldActiveName){
        // console.log('这是将要离开的标签页'+oldActiveName)
        // console.log('这是将要进入的标签页'+activeName)
        // return false 返回false是阻止切换
        // 阻止页签分类
        if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
            this.$message.error('请先选择商品的分类')
            return false
        }

    },
    async tabClicked(){
        // console.log(this.activeIndex)
        // 证明访问的的是动态参数的面板
        if(this.activeIndex === '1'){
            // console.log('动态参数面板')
            const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
                params:{sel:'many'}
            })
            // console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error('获取动态参数失败')
            }
                // attr_vals 转换成数组形式
                res.data.forEach(item=>{
                    item.attr_vals = item.attr_vals.length ===0 ? [] :item.attr_vals.split(' ')
                })
                this.manyTabData = res.data
                // console.log(this.manyTabData)                
        } else if(this.activeIndex === '2') {
            // 证明访问的是静态属性的面板
            const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
                params:{sel:'only'}
            })
            if(res.meta.status !== 200){
                return this.$message.error('获取静态属性失败！')
            }
            this.onlyTabData = res.data
            // console.log(this.onlyTabData)

        }
    },
    // 图片预览的处理函数
    handlePreview(file){
        console.log(file)
        this.previewPath = file.response.data.url
        this.previewDialogVisible = true
    },
    // 图片删除的处理函数
    handleRemove(file){
        // 将要被移除图片的信息
        // console.log(file)
        // 1.获取将要删除图片的临时路径
        const filePath = file.response.data.tmp_path
        // 2.从pics数组中找到这个图片对应是索引
        const i = this.addForm.pics.findIndex(x=>x.pic === filePath)
        // 3.调用数组的splice方法，把图片信息对象，从pics数组中移除
        this.addForm.pics.splice(i,1)
        console.log(this.addForm)
    },
    // 上传图片成功的处理函数
    handleUploadSuccess(response){
        // console.log(response)
        // 1.拼接得到一个图片信息对象
        const picInfo = {
            pic: response.data.tmp_path
        }
        // 2.将图片信息对象push到pics数组当中
        this.addForm.pics.push(picInfo)
        // console.log(this.addForm)
    },
    // 添加商品
    add(){
        // console.log(this.addForm)
        // 添加商品前，表单的预校验
        this.$refs.addFormRef.validate(async valid =>{
            if(!valid) {
                return this.$message.error('请填写表单的必填项')
            }
        
            // 添加商品的业务逻辑 
            //  对 goods_cat 进行改造
            // lodash进行深拷贝_cloneDeep(Object) 不会影响原数据
            // console.log(this.addForm)
            const form = _.cloneDeep(this.addForm)
            form.goods_cat = form.goods_cat.join(',')
            // console.log(form.goods_cat)
            // 处理动态参数列表数据
            this.manyTabData.forEach(item =>{
                const newInfo = {
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals.join(' ')
                }
                this.addForm.attrs.push(newInfo)                
            })
            // 处理静态属性列表数据
           this.onlyTabData.forEach(item=>{
              const newInfo = {
                  attr_id:item.attr_id,
                  attr_value:item.attr_vals
              }
              this.addForm.attrs.push(newInfo)  
           })
          form.attrs = this.addForm.attrs
          // console.log(form)
          // 发起请求，添加商品，商品的名称必须是唯一的 
          const {data:res} = await this.$http.post('goods',form)
          console.log(res)
          if(res.meta.status !==201){
              return this.$message.error('商品添加失败！')
          }
              this.$message.success('商品添加成功！')
              // 编程式导航到商品列表页面
              this.$router.push('/goods')
        })
    }
  },
  computed:{
    //   商品分类的id
      cateId (){
         if(this.addForm.goods_cat.length === 3){
             return this.addForm.goods_cat[2]
         } 
         return null
      }
  }
};
</script>

<style lang="less" scoped>
    .el-checkbox{
        margin: 0 10px 0 0!important;
    }
    .previewImg{
        width: 100%;
    }
    .btnAdd {
        margin-top: 15px;
    }

</style>
