<template>
  <div class="page-wrapper">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item class="form-item-select" label="身份证号： ">
      <el-input v-model="searchForm.business1" placeholder="请输入查询身份证号" clearable></el-input>
    </el-form-item>
      <el-form-item class="form-item-select" label="请求来源： ">
        <el-input v-model="searchForm.ip" placeholder="请输入请求来源" clearable></el-input>
      </el-form-item>
      <el-form-item class="form-item-select" label="设备编号： ">
        <el-input v-model="searchForm.business2" placeholder="请输入设备编号" clearable></el-input>
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
      <el-table-column prop="ip" label="请求来源" align="center" minWidth="120" ></el-table-column>
      <el-table-column prop="port" label="请求端口" align="center"  show-overflow-tooltip></el-table-column>
      <el-table-column prop="business1" label="身份证号" align="center"   minWidth="150"></el-table-column>
      <el-table-column prop="business2" label="设备编号" align="center"  minWidth="120"></el-table-column>
      <!--<el-table-column prop="business3" label="标识符" align="center"  show-overflow-tooltip></el-table-column>-->
      <el-table-column prop="type" label="操作类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 'bs'">业务</span>
          <span v-else>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="abbreviation" label="操作简单描述" align="center" minWidth="120"></el-table-column>
      <el-table-column prop="result" label="操作结果" align="center">
        <template slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.result === 1"></i>
          <i class="el-icon-error" v-else></i>
          <!--<span v-if="scope.row.result === 1">成功</span>-->
          <!--<span v-else>{{scope.row.result}}</span>-->
        </template>
      </el-table-column>

      <el-table-column prop="hisdata" label="操作前数据" align="center" minWidth="90" >
        <template slot-scope="scope">
          <el-popover placement="bottom" trigger="hover" width="300" title="操作前数据">
            <div v-if="scope.row.hisdata === null || scope.row.hisdata ===  '' ">暂无</div>
            <div v-else>
              {{ scope.row.hisdata }}
            </div>
            <el-badge is-dot class="item" slot="reference">
              <el-tag >悬停查看</el-tag>
            </el-badge>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="request" label="请求内容" align="center"  minWidth="90">
        <template slot-scope="scope">
          <el-popover placement="bottom" trigger="hover" width="300" title="请求内容">
            <div v-if="scope.row.request === null || scope.row.request === '' ">暂无</div>
            <div v-else>
              {{ scope.row.request }}
            </div>
            <el-badge is-dot class="item" slot="reference">
              <el-tag >悬停查看</el-tag>
            </el-badge>

          </el-popover>
          </template>
      </el-table-column>
      <el-table-column prop="response" label="响应内容" align="center" show-overflow-tooltip></el-table-column>

      <el-table-column prop="person" label="操作人" align="center" minWidth="110"></el-table-column>
      <el-table-column prop="createtime" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updatetime" label="修改时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="memo" label="备注" align="center"></el-table-column>
      <el-table-column label="详情" align="center" width="80">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="examine(scope.row)">查看</el-button>
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
    <el-dialog
      class="dialog-edit"
      :show-close="false"
      :close-on-click-model="false"
      :close-on-press-escape="false"
      :visible="editDialog.isShow"
      width="700px"
      title="信息查看"
      top="5vh"
    >
      <div style="font-size: 19px;text-align: center;display: flex;flex-direction: column;justify-content: space-between">
        <div>
          <div style="width: 20%;text-align: right;float: left">请求来源:</div>
          <div style="width: calc(80% - 10px);text-align: left;float: right;margin-left: 10px"> {{editDialog.model.ip}}</div>
        </div>
        <div>
          <div style="width: 20%;text-align: right;float: left">请求端口:</div>
          <div style="width: calc(80% - 10px);text-align: left;float: right;margin-left: 10px"> {{editDialog.model.port}}</div>
        </div>
        <div>
          <div style="width: 20%;text-align: right;float: left">身份证号:</div>
          <div style="width: calc(80% - 10px);text-align: left;float: right;margin-left: 10px"> {{editDialog.model.business1}}</div>
        </div>
        <div>
          <div style="width: 20%;text-align: right;float: left">设备编号:</div>
          <div style="width: calc(80% - 10px);text-align: left;float: right;margin-left: 10px"> {{editDialog.model.business2}}</div>
        </div>
        <div>
          <div style="width: 20%;text-align: right;float: left">操作类型:</div>
          <div style="width: calc(80% - 10px);text-align: left;float: right;margin-left: 10px"> {{editDialog.model.type}}</div>
        </div>
        <div>
          <div style="width: 20%;text-align: right;float: left">操作简单描述:</div>
          <div style="width: calc(80% - 10px);text-align: left;float: right;margin-left: 10px"> {{editDialog.model.abbreviation}}</div>
        </div>
        <div>
          <div style="width: 20%;text-align: right;float: left">操作结果:</div>
          <div style="width: calc(80% - 10px);text-align: left;float: right;margin-left: 10px">

              <i class="el-icon-success" v-if="editDialog.model.result === 1"></i>
              <i class="el-icon-error" v-else></i>
              <!--<span v-if="scope.row.result === 1">成功</span>-->
              <!--<span v-else>{{scope.row.result}}</span>-->


          </div>
        </div>
        <div>
          <div style="width:20%;text-align: right;float: left">操作前数据:</div>
          <div style="width: calc(80% - 10px);text-align: left;float: right;margin-left: 10px"> {{editDialog.model.hisdata}}</div>
        </div>
        <div>
          <div style="width: 20%;text-align: right;float: left">请求内容:</div>
          <div style="width: calc(80% - 10px);text-align: left;float: right;margin-left: 10px"> {{editDialog.model.request}}</div>
        </div>
        <div>
          <div style="width: 20%;text-align: right;float: left">响应内容:</div>
          <div style="width: calc(80% - 10px);text-align: left;float: right;margin-left: 10px"> {{editDialog.model.response}}</div>
        </div>
        <div>
          <div style="width: 20%;text-align: right;float: left">操作人:</div>
          <div style="width: calc(80% - 10px);text-align: left;float: right;margin-left: 10px"> {{editDialog.model.person}}</div>
        </div>
        <div>
          <div style="width: 20%;text-align: right;float: left">创建时间:</div>
          <div style="width: calc(80% - 10px);text-align: left;float: right;margin-left: 10px"> {{editDialog.model.createtime}}</div>
        </div>
        <div>
          <div style="width: 20%;text-align: right;float: left">修改时间:</div>
          <div style="width: calc(80% - 10px);text-align: left;float: right;margin-left: 10px"> {{editDialog.model.updatetime}}</div>
        </div>
        <div>
          <div style="width: 20%;text-align: right;float: left">备注:</div>
          <div style="width: calc(80% - 10px);text-align: left;float: right;margin-left: 10px"> {{editDialog.model.memo}}</div>
        </div>
      </div>

      <div slot="footer">
        <el-button type="primary" @click="editDialog.isShow = false">确定</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import request from "@/utils/request";
  export default {
    name: "audit",   // 日志审计
    data() {
      return {
        list: [],
        searchForm: {
          business1: "",
          ip:"",
          business2:""
        },
        querySubmitForm: {
          business1: "",
          ip:"",
          business2:""
        },
        editDialog:{
          isShow:false, // 是否显示
          model: {
            ip: "",
            port: "",
            business1: "",
            business2: "",
            type: "",
            abbreviation: "",
            result: "",
            request: "",
            response: "",
            person:"",
            createtime:"" ,
            updatetime:"",
            memo:""
          },

        },
        pagination: {
          total: 0, //总条数
          pageNo: 1, // 页数
          length: 8 // 每页的条数
        } // 分页控件
      };
    },
    methods: {
      // 获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/sysLog/pages",
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
      // 点击详情 弹出弹框
      examine(row){
          var that = this;
          that.editDialog.isShow = true;

        this.editDialog.model.ip = row.ip;
        this.editDialog.model.port = row.port;
        this.editDialog.model.business1 = row.business1;
        this.editDialog.model.business2 = row.business2;
        this.editDialog.model.type = row.type;
        this.editDialog.model.abbreviation = row.abbreviation;
        this.editDialog.model.result = row.result;
        this.editDialog.model.request = row.request;
        this.editDialog.model.response = row.response;
        this.editDialog.model.person = row.person;
        this.editDialog.model.createtime = row.createtime;
        this.editDialog.model.updatetime = row.updatetime;
        this.editDialog.model.memo = row.memo;
        this.editDialog.model.hisdata = row.hisdata;
      }
    },
  watch: {
    "editDialog.isShow"(newValue) {
      if (!newValue) {
        // 关闭dialog时清空表单

        this.editDialog.ip = "";
        this.editDialog.model.category = "";
        this.editDialog.model.port = "";
        this.editDialog.model.business1 = "";
        this.editDialog.model.business2 = "";
        this.editDialog.model.type = "";
        this.editDialog.model.abbreviation = "";
        this.editDialog.model.result = "";
        this.editDialog.model.request = "";
        this.editDialog.model.response = "";
        this.editDialog.model.person = "";
        this.editDialog.model.createtime = "";
        this.editDialog.model.updatetime = "";
        this.editDialog.model.memo = "";
        this.editDialog.model.hisdata = "";

      }
    }
  },
    created() {
      this.getData();
    }
  };
</script>

<style scoped>
  .editDialog{ height: 100%; }
  .demo-form-inline {
    white-space: nowrap;
    width: 100%;
  }
  .page-wrapper {
    height: 100%;
    width: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background-color: #f0f0f0;
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
  .btn{
    width: 80px;
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
