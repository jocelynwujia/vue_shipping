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
            <el-button type="primary" @click="getUserList">添加用户</el-button>
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
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
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
      this.$message.error("更新用户状态成功！");
    },
  },
};
</script>

<style lang="less" scoped>
</style>