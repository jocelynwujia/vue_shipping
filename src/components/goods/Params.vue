<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警示框 -->
      <el-alert
        title="注意：只允许第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 选择商品下拉框 -->
      <el-row class="cate_opt">
        <el-col>
          <span>商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- Tabs 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数页面 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 动态参数添加按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数的表格 -->
          <el-table :data = "manyTableData">
              <el-table-column type="expand"></el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                  </template>
              </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性页面 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 静态参数添加按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true"
            >添加属性</el-button
          >
           <!-- 静态参数的表格 -->
          <el-table :data = "onlyTableData">
              <el-table-column type="expand"></el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="参数属性" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                  </template>
              </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
    :title="'添加'+ titleText"
    :visible.sync="addDialogVisible"
    width="50%" @close = "addDialogClosed">
    <!-- 对话框 表单 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
    </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
    :title="'添加'+ titleText"
    :visible.sync="editDialogVisible"
    width="50%" @close = "editDialogClosed">
    <!-- 对话框 表单 -->
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
    </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据列表
      catelist: [],
      // 级联选择项配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
    //   被激活的页签的名称
      activeName: "many",
      //静态参数
      onlyTableData:[],
    //   动态参数
      manyTableData:[],
    //   动态添加参数、静态添加属性对话框的显示与隐藏
      addDialogVisible:false,
    //   添加参数表单的数据对象
      addForm:{
          attr_name:''
      },
    // 表单数据的校验规则
      addFormRules:{
          attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]
      },
    //   修改参数对话框的显示与隐藏
      editDialogVisible:false,
    //   修改参数的表单数据对象
      editForm:{
          attr_name:''
      },
    //   修改参数表单的校验规则
      editFormRules:{
           attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error("商品分类列表获取失败！");
      }

      this.catelist = res.data;
      // console.log(this.catelist)
    },
    // 级联选择框选中项发生变化，会触发这个函数
    handleChange() {
      // 级联选择器的选中范围，判断是不是三级
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }
      // 证明选中的是三级分类
    //   获取参数的列表数据
      this.getParamsData()
    },
    // Tab标签页点击处理函数
    handleTabClick() {
    //   console.log(this.activeName);
         this.getParamsData()
    },
    //获取参数的列表数据
  async getParamsData(){
        //   根据所选分类的id 和 当前所处的面板 获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error("分类参数获取失败！");
      }
        //  console.log(res.data);
        // 将获取的数据挂载到不同状态里
        if(this.activeName === 'only'){
            return this.onlyTableData = res.data
        } else {
            return this.manyTableData = res.data
        }
    },
    // 监听表单的关闭事件
    addDialogClosed(){
        // 重置表单校验规则
        this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加参数
    addParams(){
        //先预校验表单
        this.$refs.addFormRef.validate( async valid=>{
            if(!valid)  return               
                const {data :res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                })
                if(res.meta.status !== 201) {
                    return this.$message.error('添加参数失败！')
                }
                this.$message.success('添加参数成功！')
                this.addDialogVisible = false
                this.getParamsData()
            
        })
    },
    // 点击按钮，显示修改的对话框
    async showEditDialog(attr_id){
        // 查询当前参数的信息
        const {data:res} =await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{params:{attr_sel:this.activeName}})
        // console.log(res)
        if(res.meta.status !== 200){
          return this.$message.error('数据请求失败！')
        }
        // 拿到数据后赋值并渲染页面
        this.editForm = res.data
        this.editDialogVisible = true
    },
    // 监听修改对话框的关闭事件
    editDialogClosed(){
        // 重置修改的表单
        this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，修改参数信息
    editParams(){
        // 预校验表单
        this.$refs.editFormRef.validate( async valid=>{
            if(!valid)  return               
                const {data :res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                    attr_name:this.editForm.attr_name,
                    attr_sel:this.activeName
                })
                if(res.meta.status !== 200) {
                    return this.$message.error('修改参数失败！')
                }
                this.$message.success('修改参数成功！')
                this.getParamsData()
                this.editDialogVisible = false            
        })
    },
    // 删除参数
    // 根基id删除对应的参数项
    async removeParams(attr_id){
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult !== 'confirm') {
          return this.$message.info('取消删除')
        }
        // 删除业务逻辑
        const {data :res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if(res.meta.status !==200){
          return this.$message.error('删除失败！')
        }
          this.$message.success('删除成功！')
          this.getParamsData()
    }
  },
  // 控制添加按钮被使用的状态
  computed: {
    //如果按钮需要被禁用，则返回true
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //当前选中的三级分类的id
    cateId() {
      //   当选择第三级时，数组最后一个就是三级分类的id
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      //如果没选中，就返回null出去
      return null;
    },
    //计算
    titleText(){
        if(this.activeName === "many"){
            return "动态参数"
        } else{
            return "静态属性"
        }
    }
  },
};
</script>

<style lang="less" scoped>
.cate_opt {
  margin: 15px 0;
}
</style>