<template>
  <div class="page-wrapper">
    <el-form :inline="true" class="demo-form-inline">
      <!--
          <el-form-item class="form-item-select">
              <el-input v-model="searchForm.port" placeholder="请求端口" clearable></el-input>
          </el-form-item>
      -->
      <el-form-item class="form-item-select" label="设备编号： ">
        <el-input v-model="searchForm.deviceid" placeholder="请输入设备编号" clearable></el-input>
      </el-form-item>


      <el-form-item class="form-item-btn one">
        <el-button class="btn" type="primary" @click="querySubmit" size="medium">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 内容表格 -->
    <el-table :data="list" border :header-cell-style="{background:'rgba(203,227,251,0.6)',color:'rgb(76,164,255)'}" height="660px" >
      <el-table-column label="序号" align="center" width="50">
        <template slot-scope="scope">{{scope.$index+1}}</template>
      </el-table-column>
      <el-table-column prop="deviceid" label="设备编号" align="center"  minWidth="120">
        <template slot-scope="scope">
          <el-popover placement="bottom" trigger="hover" width="300">
            <div class="look" >
              <div v-if="scope.row.device === null"> 暂无设备信息 </div>
              <div v-else>
                <!--<div>编号：{{ scope.row.device.id }}</div>-->
                <!--<div>服役单位：{{ scope.row.device.unitId }}</div>-->
                <div style="float: left;width: 40%;display: inline-block;text-align: right">
                  单位名称：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  {{ scope.row.device.unitName }}
                </div>
                <div style="float: left;width: 40%;display: inline-block;text-align: right">
                  行政区划代号：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  {{ scope.row.device.areaCode }}
                </div>
                <div style="float: left;width: 40%;display: inline-block;text-align: right">
                  行政区划名称：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  {{ scope.row.device.areaName }}
                </div>
                <div style="float: left;width: 40%;display: inline-block;text-align: right">
                  详细地址：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  {{ scope.row.device.address }}
                </div>

                <div style="float: left;width: 40%;display: inline-block;text-align: right">
                设备所在经度：
              </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  <span v-if="scope.row.device.longitude  === ''">正在更新，请稍后</span>
                  <span v-else="">{{ scope.row.device.longitude }}</span>
                </div>
                <div style="float: left;width: 40%;display: inline-block;text-align: right">
                设备所在纬度：
              </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  <span v-if="scope.row.device.longitude  === ''">正在更新，请稍后</span>
                  <span v-else="">{{ scope.row.device.latitude }}</span>

                </div>

                <div style="float: left;width: 40%;height:32px; line-height: 32px;display: inline-block;text-align: right">
                  设备运行状态：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  <el-tag v-if="scope.row.device.state === 'ST010'" type="success">在线</el-tag>
                  <el-tag v-else-if="scope.row.device.state === 'ST020'" type="info">离线</el-tag>
                  <el-tag v-else type="danger">异常</el-tag>
                  <!--{{ scope.row.device.address }}-->
                </div>

                <div style="float: left;width: 40%;display: inline-block;text-align: right">
                  是否启用：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  <i class="el-icon-error" v-if="scope.row.device.isEnable  === 0"></i>
                  <i  class="el-icon-success" v-else></i>
                  <!--{{ scope.row.device.isEnable }}-->
                </div>

                <div style="float: left;width: 40%;display: inline-block;text-align: right">
                  厂商名称：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  <!--<i class="el-icon-error" v-if="scope.row.device.isEnable  === 0"></i>-->
                  <!--<i  class="el-icon-success" v-else></i>-->
                  <!--{{ scope.row.device.isEnable }}-->
                  {{ scope.row.device.factorName }}
                </div>
                <!--<div>所属厂商单位ID：{{ scope.row.device.factorId }}</div>-->
                <!--<div>厂商名称：{{ scope.row.device.factorName }}</div>-->
              </div>
              </div>
            <el-badge is-dot class="item" slot="reference">
<!--              <el-tag  class="curs">{{scope.row.deviceid}}</el-tag>-->
              <el-tag   class="curs">{{scope.row.deviceid}}</el-tag>
            </el-badge>

          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="mac" label="设备mac" align="center"  minWidth="150"></el-table-column>
      <el-table-column prop="type" label="类型" align="center"  show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1" >预警</el-tag>
          <el-tag v-else-if="scope.row.type === 2" type="success">故障</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column prop="extype" label="异常类型" align="center"  >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.extype === '01'" type="info">电机异常</el-tag>
          <el-tag v-else-if="scope.row.extype === '02'" type="info">读卡器异常</el-tag>
          <el-tag v-else-if="scope.row.extype === '03'" type="info">网络异常</el-tag>
          <el-tag v-else-if="scope.row.extype === '04'" type="info">摄像头异常</el-tag>
          <el-tag v-else type="info">无</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column prop="exinfo" label="异常描述" align="center" minWidth="100" >
        <template slot-scope="scope">
          <!--{{scope.row.exinfo}}-->
          <div v-if="scope.row.exinfo === 'null'" >无</div>
          <div v-else>
            <el-popover placement="bottom" trigger="hover" width="90">
       <!--       <div v-if="scope.row.exinfo.A01  === 0 ">
                <div style="float: left;width: 75%;display: inline-block;text-align: right">
                  打印机：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 25%">
                  <i  class="el-icon-success" ></i>
                </div>
              </div>
              <div v-if="scope.row.exinfo.A02  === 0 ">
                <div style="float: left;width: 75%;display: inline-block;text-align: right">
                  身份证读卡器：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 25%">
                  <i class="el-icon-error" ></i>
                </div>
              </div>
              <div v-if="scope.row.exinfo.A03  === 0 ">
                <div style="float: left;width: 75%;display: inline-block;text-align: right">
                  相机：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 25%">
                  <i class="el-icon-error" ></i>
                </div>
              </div>
              <div v-if="scope.row.exinfo.A04  === 0 ">
                <div style="float: left;width: 75%;display: inline-block;text-align: right">
                  监控摄像头：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 25%">
                  <i class="el-icon-error" ></i>

                </div>
              </div>
              <div v-if="scope.row.exinfo.A05  === 0 ">
                <div style="float: left;width: 75%;display: inline-block;text-align: right">
                  左手特写摄像头：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 25%">
                  <i class="el-icon-error" ></i>

                </div>
              </div>
              <div v-if="scope.row.exinfo.A06  === 0 ">
                <div style="float: left;width: 75%;display: inline-block;text-align: right">
                  右手特写摄像头：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 25%">
                  <i class="el-icon-error" ></i>

                </div>
              </div>
              <div v-if="scope.row.exinfo.A07  === 0 ">
                <div style="float: left;width: 75%;display: inline-block;text-align: right">
                  左手指纹仪：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 25%">
                  <i class="el-icon-error" ></i>

                </div>
              </div>
              <div v-if="scope.row.exinfo.A08  === 0 ">
                <div style="float: left;width: 75%;display: inline-block;text-align: right">
                  右手指纹仪：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 25%">
                  <i class="el-icon-error" ></i>

                </div>
              </div>
              <div v-if="scope.row.exinfo.A09  === 0 ">
                <div style="float: left;width: 75%;display: inline-block;text-align: right">
                  拍照辅助照明：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 25%">
                  <i class="el-icon-error" ></i>

                </div>
              </div>-->

<!--              <div v-for="(item,index) in ywxl">-->
<!--                <div style="float: left;width: 75%;display: inline-block;text-align: right">-->
<!--&lt;!&ndash;                  <span v-if="item.exinfo. == scope.row.minorType"> {{item.name }} </span>&ndash;&gt;-->
<!--                  <span v-for="(item1,index1) in item.exinfo"  v-if="item1  === 0 ">-->
<!--                      <span v-if="item1 == item.code"> {{item.name }} </span>-->
<!--                  </span>-->
<!--                </div>-->
<!--                <div style="float: right;display: inline-block;text-align: left;width: 25%">-->
<!--                  <i  class="el-icon-success" ></i>-->
<!--                </div>-->
<!--              </div>-->


              <div v-for="(item,value) in scope.row.exinfo">
                <div v-for="(item1,index) in ywxl">
                  <div style="float: left;width: 75%;display: inline-block;text-align: right">
                    <span v-if="item1.code == value"> {{item1.name }} </span>
                  </div>

                </div>
<!--                <div style="float: right;display: inline-block;text-align: left;width: 25%">-->
                  <i class="el-icon-error" ></i>
<!--                </div>-->
              </div>

              <el-badge is-dot class="item" slot="reference">
                <el-tag  >悬停查看</el-tag>
              </el-badge>

            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="isDeal" label="是否处理" align="center">
        <template slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.isDeal === 1"></i>
          <i class="el-icon-error" v-else></i>
          <!--<span v-if="scope.row.isDeal === 1">是</span>-->
          <!--<span v-else>{{scope.row.isDeal}}</span>-->
        </template>
      </el-table-column>

      <el-table-column prop="createtime" label="异常上传时间" align="center" minWidth="120"></el-table-column>
      <!--<el-table-column prop="updatetime" label="修改时间" align="center" show-overflow-tooltip></el-table-column>-->

      <el-table-column prop="memo" label="备注" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="handleTime" label="处理时间" align="center" minWidth="120"></el-table-column>
      <el-table-column prop="handlePeople" label="处理人" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="handleOpinion" label="处理意见" align="center" show-overflow-tooltip></el-table-column>

      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="beginUpdate(scope.row)" v-if="scope.row.isDeal  === 0">异常消除</el-button>
          <el-button size="mini" type="primary"  v-else="scope.row.isDeal  === 1" disabled>异常消除</el-button>
          <!--<el-button size="mini" type="danger" @click="beginRemove(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="sizeChangeHandler"
      @current-change="currentChangeHandler"
      :current-page="pagination.pageNo"
      :page-sizes="[6, 8, 10, 20, 30, 40]"
      :page-size="pagination.length"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
    ></el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
  import request from "@/utils/request";
  export default {
    name: "abnormal",   // 异常信息管理
    data() {
      return {
        list: [],
        searchForm: {
          deviceid: "",
        },
        querySubmitForm: {
          deviceid: "",
        },

        pagination: {
          total: 0, //总条数
          pageNo: 1, // 页数
          length: 8 // 每页的条数
        }, // 分页控件
        ywxl:[],
      };
    },
    methods: {
      // 获取业务
      getDataxiaol(){
        let that = this;
        request({
          url: "/sysParm",
          method: "get",
          params: {

            typeCode:'01'
          }
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.ywxl = response.data.data;
              // that.list = response.data.data;
              // that.pagination.total = response.data.recordsTotal;
              console.log(response,222)
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/sysDeviceWarn/pages",
          method: "get",
          params: {
            ...that.querySubmitForm,
            length: that.pagination.length,
            pageNo: that.pagination.pageNo,

          }
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.list = response.data.data;
              that.pagination.total = response.data.recordsTotal;
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 查询
      querySubmit() {
        this.querySubmitForm = Object.assign({}, this.searchForm);
        this.getData((this.pagination.pageNo = 1));
      },

      // 换每页条数
      sizeChangeHandler(length) {
        this.pagination.length = length;
        this.getData();
      },
      // 换页
      currentChangeHandler(pageNo) {
        this.pagination.pageNo = pageNo;
        this.getData();
      },

      // 手动处理
      beginUpdate(row){
        let that = this;
        console.log(row)
//        if(row.isDeal === 1) return;
//        else {
            request({
              url: "/sysDeviceWarn/ex ",
              method: "PUT",
              data: {
                id:row.id,
                handleOpinion:row.handleOpinion,
//                isDeal:1
//                row.isDeal
              }
//              JSON.stringify()
            })
              .then(function(response) {
                if (response.data.code === 20000) {
                  that.getData();
                  that.$message({
                    type: "success",
                    message: "处理成功"
                  });


                }
              })
              .catch(function(error) {
                console.log(error, "报错信息");
              });
//        }
      }
    },
    created() {
      this.getData();
      this.getDataxiaol();
    }
  };
</script>

<style scoped>
  .demo-form-inline {
    white-space: nowrap;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    display: flex;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  .demo-form-inline > * {
    margin: 0;
    margin-right: 50px;
  }
  .btn{
    width: 80px;
  }
  .page-wrapper {
    height: 100%;
    width: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  .page-wrapper > .el-form {
    height: 60px;
    flex-shrink: 0;
  }

  .page-wrapper > .el-table {
    flex-grow: 1;
    overflow: auto;
    background-color: #f0f0f0;
    margin-bottom: 10px;
  }

  .page-wrapper > .el-pagination {
    height: 90px;
    flex-shrink: 0;
    text-align: center;
  }

  .form-item-btn {
    width: calc((90% - 285px) / 2);
  }
  .form-item-btn.one {
    text-align: left;
  }
  .form-item-btn.two {
    text-align: right;
  }
  .el-icon-success{ color: rgb(102,177,255);font-size: 18px; }
  .el-icon-error{ color: red;font-size: 18px; }
  .item {
    margin-top: 5px;

  }
</style>
