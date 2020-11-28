<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avater_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        :model="loginForm"
        :rules="loginformRules"
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //登录表单的校验
      loginformRules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //点击重置按钮，重置表单数据
    resetLoginForm() {
      //   console.log(this)
      // $refs.loginFormRef拿到表单的实例对象，运用表单的resetFields()方法进行校验
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      //validdate()参数是回调函数，返回值为布尔值，如果不传值，返回的就是promise
      this.$refs.loginFormRef.validate( async valid =>{
        //   console.log(valid)
        if(!valid) return
        //如果用户输入合法，调用axios请求数据
        const {data:res} = await this.$http. post('login',this.loginForm)
        console.log(res)
        if(res.meta.status !==200) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        //登录成功之后，拿到token的值存储到客户端的sessionStorage，项目中其他有权限的API需要再登录成功之后才能访问
        //因为token只在打开期间有效，所以存储在sessionStorage中
        window.sessionStorage.setItem('token',res.data.token)
        //通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      });
    },
  },
};
</script>

<style lang = "less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avater_box {
    padding: 10px;
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>>
