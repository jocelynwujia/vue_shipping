<template>
    <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
<<<<<<< HEAD
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
=======
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
>>>>>>> 20.商品分类
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
<<<<<<< HEAD
        <!-- 按钮 -->
        <el-row>
            <el-col>
                <el-button type="primary">添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 表格区域 -->
        <tree-table :data = CateList :columns="columns" :selection-type="false" :expand-type ="false" show-index index-text = "#" border :show-row-hover ="false">
            <!-- 是否有效 -->
            <template slot="isOk" slot-scope="scope">
                <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                <i class="el-icon-error" v-else style="color:red"></i>
            </template>
            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
                <el-tag size="mini" v-if ="scope.row.cat_level === 0">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if ="scope.row.cat_level === 1">二级</el-tag>
                <el-tag type="warning" size="mini" v-else>三级</el-tag>
            </template>
            <!-- 操作 -->
            <template slot="option" slot-scope="">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">编辑</el-button>
            </template>

        </tree-table>
=======
         <el-row>
             <el-col>
                 <!-- 添加按钮 -->
                 <el-button type="primary" @click="showAddCateDialog" class="addCatebtn">添加角色</el-button>
             </el-col>
         </el-row>
        <!-- 树形表格区 -->
        <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text ="#" border :show-row-hover="false"> 
               <template slot="isOk" slot-scope="scope">
                   <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                   <i class="el-icon-error" style="color:red" v-else></i>
               </template>
               <template slot="order" slot-scope="scope">
                   <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
                   <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
                   <el-tag type="danger" v-else size="mini">三级</el-tag>
               </template>
               <template slot="operation" >
                   <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                   <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
               </template>
        </tree-table>

>>>>>>> 20.商品分类
        <!-- 分页区域 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
<<<<<<< HEAD
        :page-sizes="[3,5,10,15]"
        :page-size="queryInfo.pagesize"
        :current-page="queryInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        
        </el-pagination>
           
    </el-card>
    </div>
    

=======
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
    title="添加分类"
    :visible.sync="addCateDialogVisible"
    width="50%">
    <!-- 添加分类的表单 -->
    <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" @close = "addCateDialogClosed">
        <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
            <!-- options用来指定数据源 props级联选择器的配置选项-->
            <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"></el-cascader>
        </el-form-item>
    </el-form>
    <!-- 底部按钮 -->
    <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
    </span>
    </el-dialog>

    </div>
>>>>>>> 20.商品分类
</template>

<script>
export default {
<<<<<<< HEAD
  data() {
    return {
      //查询条件
      queryInfo: {
        type: 3,
        // 当前页面数
        pagenum: 1,
        // 每页显示几条数据
        pagesize: 5,
      },
      //商品的分类的数据列表，默认为空
      CateList: [],
      // 总数据条数
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          width: "400px",
        },
        {
          label: "是否有效",
          // 表示将当前页定义为模板列
          type: "template",
          // 这一列使用的模板名称
          template: "isOk",
        },
        {
          label: "排序",
          // 表示将当前页定义为模板列
          type: "template",
          // 这一列使用的模板名称
          template: "order",
        },
        {
          label: "操作",
          // 表示将当前页定义为模板列
          type: "template",
          // 这一列使用的模板名称
          template: "option",
        },
      ],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品的列表数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {params: this.queryInfo});
      if (res.meta.status !== 200) {
        return this.$message.error("商品列表数据获取失败！");
      }

      // console.log(res.data)
      // 把数据给到数据列表
      this.CateList = res.data.result;
      // 为总数据条数赋值
      // console.log(this.CateList);
      this.total = res.data.length;
      // console.log(this.total)
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getCateList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getCateList()
    }
  },
};
</script>

<style lang = "less" scoped>
=======
    data(){
        return{
             // 查询条件
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 商品分类数据
            catelist:[],
            // 总数据条数
            total:0,
            // 为tab指定一个列的定义
            columns:[{
                label:'分类名称',
                prop:'cat_name'
            },{
                label:'是否有效',
                prop:'cat_deleted',
                // 表示定义当前列为模板列
                type: 'template',
                // 表示当前这一页定义的模板名称
                template: 'isOk',
            },{
                label:'排序',
                prop:'cat_pid',
                // 表示定义当前列为模板列
                type: 'template',
                // 表示当前这一页定义的模板名称
                template: 'order',
            },{
                label:'操作',
                // 表示定义当前列为模板列
                type: 'template',
                // 表示当前这一页定义的模板名称
                template: 'operation',
            }],
            // 控制添加分类对话框的显示与隐藏
            addCateDialogVisible:false,
            // 添加分类的表单数据对象
            addCateForm:{
                // 将要添加的分类的名称
                cat_name:'',
            //  父级分类的Id
                cat_pid:0,
                // 分类的等级默认是一级分类
                cat_level:0
            },
            addCateFormRules:{
                cat_name:[{ required: true, message: '请输入分类的名称', trigger: 'blur' }]
            },
            // 父级分类的数据列表
            parentCateList:[],
            // 级联选择器的配置项
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger: 'hover',
                // multiple: true, 
                checkStrictly: true 
            },
            // 选中的父级分类的数组
            selectedKeys:[]
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        // 获取商品分类列表
        async getCateList(){
            const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
            // console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error('商品分类数据获取失败！')
            }
            this.total = res.data.total
            this.catelist = res.data.result
        },
        // 当每页的显示条数发生变化会触发的函数
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        // 当前页码数发生变化时会触发的函数
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        // 展示添加分类的对话框
        showAddCateDialog(){
            // 先获取父级分类的数据
            this.getParentCateList()
            // 在展示出对话框
            this.addCateDialogVisible = true
        },
        // 获取父级分类的数据列表
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}})
            // console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error('获取数据失败！')
            }
            this.parentCateList = res.data
            // console.log(this.parentCateList)
        },
        // 选择项发生变化时触发的函数
        parentCateChange(){
            console.log(this.selectedKeys)
            // 如果数组selectedKeys的length大于0，则选中的是父级分类，反之，则说明没有选中任何父级分类
            if(this.selectedKeys.length > 0){
                // 父级分类的id
                // selectedKeys 数组最后一项为父级id
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
                // console.log(this.addCateForm.cat_pid)
                // console.log(this.selectedKeys)
                // console.log('111')
                // 为当前的分类等级分类
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            }else{
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        // 点击按钮，添加分类
        addCate(){
            console.log(this.addCateForm)
            // 表单预校验
            this.$refs.addCateFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.post('categories',this.addCateForm)
                if(res.meta.status !== 201){
                    return this.$message.error('添加分类失败！')
                }
                this.$message.success('添加分类成功！')
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        // 监听添加对话框关闭事件,重置表单数据
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        }
        
    }
}
</script>

<style lang="less" scoped>
    .addCatebtn {
        margin-bottom: 15px;
    }
    .el-cascader{
        width: 100%;
    }
>>>>>>> 20.商品分类
</style>