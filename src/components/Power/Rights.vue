<template>
    <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
       <el-table :data = rightlist border stripe>
           <el-table-column type="index"></el-table-column>
           <el-table-column label="权限名称" prop="authName"></el-table-column>
           <el-table-column label="路径" prop="path"></el-table-column>
           <el-table-column label="权限等级" prop="level">
               <template slot-scope="scope">
                   <el-tag v-if="scope.row.level === '0'">标签一</el-tag>
                   <el-tag type="success" v-else-if="scope.row.level === '1'">标签二</el-tag>
                   <el-tag type="warning" v-else> 标签三</el-tag>
               </template>
           </el-table-column>
       </el-table>
    </el-card>
    </div>
    
</template>

<script>
export default({
    data(){
        return{
            //权限列表数据
            rightlist:[]
        }
    },
    created(){
        this.getRightsList()
    },
    methods:{
        async getRightsList(){
              //请求数据
       const {data:res} =await this.$http.get('rights/list')
    //    console.log(res)
       if(res.meta.status !== 200) {
           return this.$message.error('获取权利列表数据失败！')
       }
       this.$message.success('获取权利列表数据成功！')
    //    把获取到数数据赋值给rightlist
       this.rightlist = res.data
       }
    }       
})
</script>

<style lang="less" scoped>

</style>