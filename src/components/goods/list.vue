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
      <el-row :gutter="20">
          <!-- 搜索框 -->
          <el-col :span="8">
              <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
          </el-col>
          <!-- 添加商品按钮 -->
          <el-col :span="4">
              <el-button type="primary" @click="goAddPage">添加商品</el-button>
          </el-col>
      </el-row>        
      <!-- 商品列表表格 -->
      <el-table :data="goodsList" border stripe>
           <el-table-column type="index" label="#"></el-table-column>
           <el-table-column label="商品名称" prop="goods_name"></el-table-column>
           <el-table-column label="商品价格" prop="goods_price" width="95px"></el-table-column>
           <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
           <el-table-column label="创建时间" width="140px">
               <!-- 作用域插槽 -->
               <template slot-scope="scope">
                   {{scope.row.add_time | dateformat}}
               </template>
           </el-table-column>
           <el-table-column label="操作" width="180px">
               <template slot-scope="scope">
                   <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                   <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)">删除</el-button>
               </template>
           </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total" background>
    </el-pagination>
      
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
         query:"",
            // 当前商品列表的页码数
         pagenum: 1,
            // 每页显示多少条商品
         pagesize: 10,
      },
      // 商品列表
      goodsList: [],
    //   商品的总条数
      total:0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //   根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if(res.meta.status !== 200){
          return this.$message.error('获取商品列表失败！')
      }
          this.goodsList = res.data.goods
          this.total = res.data.total
    },
    // 每页显示商品条数发生变化时触发函数
    handleSizeChange(newSize){
        // 拿到最新每页显示的条数
        this.queryInfo.pagesize = newSize
        // 刷新页面
        this.getGoodsList()
        
    },
    // 当前页码发生改变时触发的函数
    handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
    },
    // 根据id删除对应的商品
    async removeById(id){
        // 询问是否需要删除商品
        const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult !== 'confirm'){
            return this.$message.error('取消删除')
        }
        //    确认删除后将新数据提交给后台
        const {data :res} = await this.$http.delete(`goods/${id}`)
        if(res.meta.status !==200) {
            return this.$message.error('删除失败！')
        }
            this.$message.success('删除成功！')
            // 刷新页面
            this.getGoodsList()
    },
    //点击按钮，跳转编程式导航到添加商品页面
    goAddPage(){
        this.$router.push('/goods/add')
    }
  },
};
</script>

<style lang = "less" scoped>
</style>