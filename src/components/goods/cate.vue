<template>
    <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
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
        <!-- 分页区域 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[3,5,10,15]"
        :page-size="queryInfo.pagesize"
        :current-page="queryInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        
        </el-pagination>
           
    </el-card>
    </div>
    

</template>

<script>
export default {
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
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfos,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("商品列表数据获取失败！");
      }

    //   console.log(res.data)
      //把数据给到数据列表
      this.CateList = res.data;
      // 为总数据条数赋值
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
</style>