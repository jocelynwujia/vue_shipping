<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->

    <el-card>
      <div>
        <!-- 搜索 与 添加-->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
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
            <template slot-scope="">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
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
        :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 对话框主体内容区 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
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
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
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
    }
  },
};
</script>

<style lang="less" scoped>
</style>