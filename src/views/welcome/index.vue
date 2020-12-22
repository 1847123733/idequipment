<template>
    <div class="wrapper">
      <div class="pt-data">
        <div class="pt-data-top">
          <h1>监管平台基本信息</h1>
        </div>
        <div class="pt-data-bom">
          <el-row  style="display: flex;width: 95%;justify-content: space-between;height: 100%">
            <el-col style="width: 48%;height: 100%">
              <el-card style="display: flex;flex-direction: column;justify-content: space-between;height: 100%;align-items: center">
                <div style="height: 40px;line-height: 40px">
                  <span>技术支持公司:</span>
                  <span>
                    青岛通产智能科技股份有限公司
                  </span>
                </div>
                <div style="height: 40px;line-height: 40px">
                  <span>注册号:</span>
                  <span>
                    370202228161211
                  </span>
                </div>
                <div style="height: 40px;line-height: 40px">
                  <span>企业地址:</span>
                  <span>
                    山东省青岛市高新区聚贤桥路2号
                  </span>
                </div>
                <div style="height: 40px;line-height: 40px">
                  <span>技术支持:</span>
                  <span>
                    青岛通产智能科技股份有限公司信息部
                  </span>
                </div>
              </el-card>
            </el-col>
            <el-col style="width: 48%;height: 100%">
              <el-card style="display: flex;flex-direction: column;justify-content: space-between;height: 100%;align-items: center">
                <div style="height: 40px;line-height: 40px">
                  <span>平台名称:</span>
                  <span>身份证设备运行监管平台</span>
                </div>
                <div style="height: 40px;line-height: 40px">
                  <span>版本号:</span>
                  <span>1.0</span>
                </div>
                <div style="height: 40px;line-height: 40px">
                  <span>平台部署地:</span>
                  <span>贵州</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

      </div>
      <div class="cx-data">
          <h1>用户信息</h1>
      </div>
      <div class="yh-data">
          <el-table
            :data="list"
            border
            style="width: 100%"
            :header-cell-style="{background:'rgb(203,227,251)',color:'rgb(76,164,255)'}">
            <el-table-column prop="id" label="登陆ID" align="center"></el-table-column>
            <el-table-column prop="name" label="姓名" align="center"></el-table-column>
            <el-table-column prop="sex" label="性别" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.sex === '1'">男</span>
                <span v-else>女</span>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" align="center"></el-table-column>
            <el-table-column prop="roles[0].rolename" label="所属角色" align="center"></el-table-column>
            <el-table-column prop="units.name" label="所属单位" align="center"></el-table-column>
            <el-table-column prop="createtime" label="用户创建时间" align="center"></el-table-column>
          </el-table>

      </div>
    </div>

</template>



<script type="text/ecmascript-6">
  import request from "@/utils/request";

export default {
  name:"welcome",   // 主页  欢迎
    data(){
        return{
          list:[],
          id:'',
        }
},
  methods: {
    getData() {
      let that = this;
      request({
        url: "/sysUser/pages",
        method: "get",
        params: {
          id:that.id,
          date: Date.parse(new Date())
        }
      })
        .then(function(response) {
          if (response.data.code === 20000) {
            that.list = response.data.data;


             console.log(that.list);
            //   that.roleIds = [];
            //   for (var i = 0; i < response.data.data.length; i++) {
            //     // console.log(response.data.data[i].username)
            //     that.roleIds.push(
            //       response.data.data[i].roles[0].id
            //     );
            //     // that.users.push(response.data.data[i].username)
            //   }
          }
        })
        .catch(function(error) {
          console.log(error, "报错信息");
        });
    },
  },
  created() {
      this.id = localStorage.getItem("id");
      this.getData();

  }


}
</script>

<style scoped>
.wrapper{ width: 100%;height: 100%;display: flex;flex-direction: column; }
.pt-data{ height: 250px;flex-shrink: 0;display: flex;flex-direction: column; }
.pt-data-top{ height:50px;flex-shrink: 0;display: flex;justify-content: center;align-items: center; }
.pt-data-bom{ height: calc(100% - 50px);display: flex;justify-content: center; }
.cx-data{ height: 50px;flex-shrink: 0;display: flex;flex-direction: column;justify-content: center;align-items: center;margin-top: 20px }
.yh-data{ height: calc(100% - 320px);padding: 10px  45px 0px 45px;box-sizing: border-box;}
.el-table td, .el-table th.is-leaf,.el-table--border, .el-table--group{  border-color: rgb(169,210,255);  }
.el-table--border::after, .el-table--group::after, .el-table::before{  background-color: rgb(169,210,255);  }
.box-card{ width: 90%;display: flex;justify-content: center;align-items: center; }
</style>
