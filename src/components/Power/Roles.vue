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
      <el-button type="primary">添加角色</el-button>
      <el-table :data="roleslist" border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbuttom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 横向展示 用el-row则竖向展示-->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      :class="i3 === 0 ? '' : 'bdtop'"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-settings"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 展示分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="SetRightDialog" width="50%" @close="SetRightDialogClosed">
        <!-- tree树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key = "id" default-expand-all :default-checked-keys = "defkeys" ref="treeRef"></el-tree>
      <!-- 分配权限对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色数据列表
      roleslist: [],
      // 控制分配权限对话框的展示与隐藏
      SetRightDialog: false,
       // 所有权限数据列表
      rightslist: [],
    //   树形控件的属性绑定对象
      treeProps:{
          label:'authName',
          children:'children'
      },
      //默认选中的节点id值数组
      defkeys:[],
      //当前即将分配权限的角色id
      roleId:[]
    };
  },
  created() {
    this.getRolesList();
  },

  methods: {
    // 获取角色数据
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error("角色数据获取信息失败！");
      }
    //   this.$message.success("角色数据获取信息成功！");
      //把获取到的数据给到roleslist
      this.roleslist = res.data;
    },
    //根据Id删除对应的权限
    async removeRightById(role, rightId) {
      //弹框提示客户是否需要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.error("取消删除用户权限");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户权限失败！");
      }
      this.$message.success("删除用户权限成功！");
      // 返回的data, 是当前角色下最新的权限数据
      // 重新为当前的角色赋值权限,而调用getRolesList()会刷新整个页面
      role.children = res.data;
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
        // 获取分配权限的角色id
        this.roleId = role.id
    //   请求获取所有权限列表
      const {data:res} =await this.$http.get('rights/tree')  
      if(res.meta.status !== 200) {
          return this.$message.error('所有权限列表获取失败！')
      }
    //   console.log(res)
     
    //   把获取到的数据存储到data当中
      this.rightslist = res.data
         // 递归获取所有三级节点的id
      this.getleafKeys(role,this.defkeys)
      this.SetRightDialog = true;
    },
    //通过递归方式获取三级节点的id，并保持到defkeys数组当中
     getleafKeys(node,arr){
        //  如果当前节点不包含children属性，则是三级节点
         if(!node.children){
             return arr.push(node.id)
         }
         node.children.forEach(item => {
             this.getleafKeys(item,arr)
         })
    },
    // 关闭分配权限对话框
    SetRightDialogClosed(){
        // 清空defkeys数组中的数据
        this.defkeys=[]
    },
    // 点击确认按钮，为角色分配权限
    async allotRights(){
        // 获取所有被选中、叶子节点的key和半选中节点的key
        const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys(),
        ]
        // console.log(keys)
        // 接口文档中需要字符串类型，转化成字符串
        const idStr =  keys.join()
        //调用接口请求数据
        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
        // console.log(res)
        if(res.meta.status !== 200){
            return this.$message.error('分配权限失败！')
        }
        this.$message.success('分配权限成功')
        // 重新渲染页面
        this.getRolesList()
        //关闭分配权限对话框
        this.SetRightDialog = false
    }
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin-top: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbuttom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>