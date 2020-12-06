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
              @clear="getOrderList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getOrderList"
              ></el-button>
            </el-input>
          </el-col>
        </el-row>
        <!-- 订单表格 -->
        <el-table :data="orderlist" stripe>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="订单编号" prop = "order_number"></el-table-column>
            <el-table-column label="订单价格" prop = "order_price"></el-table-column>
            <el-table-column label="是否付款" prop = "order_pay">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.pay_status === 1" >已付款</el-tag>
                    <el-tag type="danger" v-else>未付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="是否发货" prop = "is_send">
                <template slot-scope="scope">
                    {{scope.row.is_send}}
                </template>
            </el-table-column>
            <el-table-column label="下单时间" prop = "create_time">
                <template slot-scope = "scope">
                    {{scope.row.create_time | dateformat}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showBox"></el-button>
                <el-button type="success" icon="el-icon-location" circle size="mini" @click="showProgressBox"></el-button>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20]"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
        
        <!-- 修改地址对话框 -->
        <el-dialog
        title="修改地址"
        :visible.sync="addressDialogVisible"
        width="50%" @close = "addressClosed">
        <!-- 表单 -->
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
            <el-form-item label="省市县" prop="address1">
                <el-cascader
                v-model="addressForm.address1"
                :options="cityData"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
                <el-input v-model="addressForm.address2"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addressDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
        </span>
       </el-dialog>

       <!-- 物流进度对话框 -->
       <el-dialog
        title="物流进度"
        :visible.sync="ProgressDialogVisible"
        width="50%">
        <!-- 时间线 -->
        <el-timeline>
            <el-timeline-item
            v-for="(activity, index) in progerssInfo"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
            </el-timeline-item>
        </el-timeline>
        </el-dialog>
      </div>
    </el-card>
   </div>

</template> 

<script>
import cityData from './citydata.js'
export default {
    data(){
        return {
            queryInfo:{
                pagenum:1,
                pagesize:10
            },
            // 订单列表数据
            orderlist:[],
            total:0,
            // 控制修改地址的显示与隐藏
            addressDialogVisible:false,
            
            addressForm:{
   
            },
            address1:[],
            address2:'',
            addressFormRules:{
                address1:[{ required: true, message: '请选择省市县', trigger: 'blur'}],
                address2:[{ required: true, message: '请填写详细地址', trigger: 'blur'}]
            },
            cityData:cityData,
            // 控制物流进度对话框的显示与隐藏
            ProgressDialogVisible:false,
            // 物流信息
            progerssInfo:[]
        }
    },
    created(){
        this.getOrderList()
    },
    methods:{
        // 获取订单列表
        async getOrderList(){
            const {data:res}= await this.$http.get('orders',{params: this.queryInfo})
            // console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error('订单数据获取失败！')
            }
            this.total = res.data.total
            this.orderlist = res.data.goods
        },
        // 每页显示条数发生变化时，触发的事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        // 当前页码发生变化时，触发的事件
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        // 修改地址
        showBox(){
            this.addressDialogVisible = true
        },
        // 监听表单关闭事件
        addressClosed(){
            this.$refs.addressFormRef.resetFields()
        },
        // 物流进度
        async showProgressBox(){
            const {data:res} = await this.$http.get('kuaidi/DPK210206915703')
            // console.log(res)
            if(res.meta.status !== 200){
                return this.$message.error('物流进度获取失败！')
            }
            this.progerssInfo = res.data
            this.ProgressDialogVisible = true
            // console.log(this.progerssInfo);
        }

        
    }
}
</script>

<style lang="less" scoped>
    .el-cascader {
        width: 100%;
    }
</style>