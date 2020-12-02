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
      <div>
        <!-- 搜索 与 添加-->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </el-col>
        </el-row>

        <!-- 数据表格 -->
        <el-table :data="userlist" stripe>
          <!-- 用户信息 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <!-- {{ scope.row }} -->
              <!-- scope.row 可以拿到数据 -->
              <!-- 同时指定prop和作用域插槽，那么作用域插槽会覆盖prop -->
              <el-switch
                v-model="scope.row.mg_state"
                @change="userStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="setRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
        <!-- 添加用户对话框 -->
        <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
          width="50%"
          @close="addDialogClosed"
        >
          <!-- 对话框主体内容区 -->
          <el-form
            :model="addForm"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="70px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- 对话框底部区 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog
          title="修改用户"
          :visible.sync="editDialogVisible"
          width="50%"
          @close="editDialogClosed"
        >
          <!-- 修改用户对话框主体部分 -->
          <el-form
            :model="editForm"
            :rules="editFormRules"
            ref="editFormRef"
            label-width="70px"
          >
            <el-form-item label="用户名">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 展示分配角色对话框 -->
        <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%" @close = "roleDialogClosed">
        <div>
          <p>当前用户名字是：{{userinfo.username}}</p>
          <p>当前用户角色是：{{userinfo.role_name}}</p>
          <p>请重新分配角色：
            <!-- 角色下拉菜单提示 -->
            <el-select v-model="selectedRoledId" placeholder="请选择角色">
              <el-option
                v-for="item in rolelist"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>

      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    //   邮箱的校验规则
    var checkEmail = (rule,value,cb)=>{
        // 定义邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/
        if(regEmail.test(value)){
            //合法的邮箱
            return cb()
        }
        cb(new Error('请输入合法的邮箱'))
    }
    //   手机号的校验规则
    var checkMobile = (rule,value,cb)=>{
        // 定义手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(regMobile.test(value)){
            //合法的手机号
            return cb()
        }
        cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户的数据
      queryInfo: {
          //获取用户列表的参数对象
        query: "",
        // 当前的页数
        pagenum: 1,
        //每页显示多少条数据
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      // 添加用户对话框显示与隐藏
      addDialogVisible:false,
    //   添加用户的表单数据
      addForm:{
          username:'',
          password:'',
          email:'',
          mobile:''
      },
    //   添加表单的验证规则
      addFormRules:{
          username:[{required:true,message:'请输入用户名',trigger:'blur'},{min:3,max:10,message:'请输入3~10个字符'}],
          password:[{required:true,message:'请输入密码',trigger:'blur'},{min:3,max:10,message:'请输入3~10个字符'}],
          email:[{required:true,message:'请输入邮箱',trigger:'blur'},{ validator: checkEmail, trigger: 'blur' }],
          mobile:[{required:true,message:'请输入手机',trigger:'blur'},{ validator: checkMobile, trigger: 'blur' }]
      },
      //修改用户对话框的显示与隐藏
      editDialogVisible:false,
      //用户需要修改时，查询用户数据
      editForm:{},
      //修改用户的验证规则
      editFormRules:{
        email:[{required:true,message:'请输入邮箱',trigger:'blur'},{ validator: checkEmail, trigger: 'blur' }],
         mobile:[{required:true,message:'请输入手机',trigger:'blur'},{ validator: checkMobile, trigger: 'blur' }]
      },
      // 展示分配角色对话框的显示与隐藏
      setRoleDialogVisible:false,
      //需要被分配角色的用户信息
      userinfo:{},
      //可以选择的用户角色
      rolelist:[],
      // 已选中角色的id
      selectedRoledId:''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //  获取用户信息并渲染
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      //   console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户信息失败");
      //获取userlist数据
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      // 把拿到的pagesize重新赋值给queryInfo
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage;
    },
    //监听 switch 开关的 change 事件
    async userStatusChange(userinfo) {
      console.log(userinfo);
      //拿到数据发起put请求存储到数据库
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        //如果失败需要将用户状态重置回去
        this.userinfo.mg_state = !this.userinfo.mg_state;
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.error("更新用户状态成功！")
    },
    //监听添加用户对话框的 关闭事件
    addDialogClosed(){
        //重置表单
        this.$refs.addFormRef.resetFields()
    },
    //点击确定按钮 添加新用户
    addUser(){
        //添加新用户前的表单预校验
        this.$refs.addFormRef.validate(async valid=>{
            //validdate()参数是回调函数，返回值为布尔值，如果不传值，返回的就是promise
            // console.log(valid)
            if(!valid) return
            //如果通过，可以发起添加用户的网络请求
            const {data:res}=await this.$http.post('users', this.addForm)
            console.log(res)
            if(res.meta.status !== 201) {
                return this.$message.error('添加新用户失败！')
            }

            this.$message.error('添加新用户成功')
            //添加新用户成功以后，关闭对话框
            this.addDialogVisible = false
            //并重新获取用户列表的数据
            this.getUserList()
        })
    },
    // 点击编辑按钮，修改用户信息
    async showEditDialog(id){
        //调用接口请求当前点击id的数据
       const {data:res}=await this.$http.get('users/'+id)
      //  console.log(res) 
      if(res.meta.status !==200){
        return this.$message.error('查询用户信息失败！')
      }
    // 如果成功的话将数据给到查询数据对象
      this.editForm = res.data
      this.editDialogVisible = true
      //重新获取用户信息并渲染
      this.getUserList()
    },
    //监听修改用户对话框 的关闭事件
    editDialogClosed(){
      // 重置表单（清空表单验证的消息）
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo(){
      console.log('ok')
      //表单的预校验
      this.$refs.editFormRef.validate(async valid=>{
        // console.log(valid)
      if(!valid) return
      //发起用户的信息的数据请求
        const {data:res}=await this.$http.put('users/'+this.editForm.id,
        {
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
        // console.log(res)
        if(res.meta.status !==200) return this.$message.error('更新用户信息失败！')
        //更新数据成功
        // 1.关闭对话框
        this.editDialogVisible = false
        // 2.刷新数据列表
        this.getUserList()
        // 3.提示更新成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 删除用户信息
    async removeUserById(id){
      const confirmResults = await this.$confirm('永久删除用户信息, 是否继续?', '删除用户信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
      // 1.打印的是promise对象，故用await async
      // 2.点击确认按钮，返回的是字符串 confirm
      // 3.点击确认按钮，返回的是字符串 cancel
      // console.log(confirmResults) 
        if(confirmResults !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        // console.log('删除成功！')
        const {data:res} = await this.$http.delete('users/'+id)
        // console.log(res)
        if(res.meta.status !== 200) {
          return this.$message.error('删除用户失败！')
        }
        this.$message.success('删除用户成功!')
        //删除成功后，刷新用户列表
        this.getUserList()
    },
    // 展示用户分配角色
    async setRole(userinfo){
      // 接收当前需要分配角色的用户信息
      this.userinfo = userinfo
      // 在对话框显示之前拿到角色数据
      const {data:res} =await this.$http.get('roles')
      // console.log(res)
      if(res.meta.status !==200 ){
        return this.$message.error('获取角色列表数据失败！')
      }
      //将角色列表数据存储到data当中
      this.rolelist = res.data
      this.setRoleDialogVisible = true
    },
    // 点击确认按钮，修改用户角色
    async saveRoleInfo(){
      if(!this.selectedRoledId){
        return this.$message.error('请选择分配角色')
      }
      //将修改数据发送给服务器
      const {data:res}= await this.$http.put(`users/${this.userinfo.id}/role`,{
        rid:this.selectedRoledId
      })
      if(res.meta.status !== 200) {
        return this.$message.error('分配角色失败！')
      }
      this.$message.success('分配角色成功！')
      // 刷新数据
      this.getUserList()
      //关闭对话框
      this.setRoleDialogVisible = false
    },
    //监听分配角色对话框的关闭事件
    roleDialogClosed(){
      //清空选中角色数据
      this.selectedRoledId = ''
      // this.userinfo = ''
      // console.log(this.userinfo)
    }
  },
};
</script>

<style lang="less" scoped>
</style>