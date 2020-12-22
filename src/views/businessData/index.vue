<template>
  <div class="page-wrapper">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item class="form-item-select" label="身份证号： ">
        <el-input v-model="searchForm.cardId" placeholder="请输入查询身份证号" clearable></el-input>
      </el-form-item>
      <el-form-item class="form-item-select" label="业务类型： ">
        <!--<el-input v-model="searchForm.genType" placeholder="请输入查询业务类型" clearable></el-input>-->
        <el-select v-model="searchForm.genType" placeholder="请选择查询业务类型" @change="selectUnitName3" clearable>
          <el-option v-for="item in lx" :key="item.index" :label="item.label" :value="item.index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-item-select" label="设备编号： ">
        <el-input v-model="searchForm.deviceid" placeholder="请输入查询设备编号" clearable></el-input>
      </el-form-item>
      <el-form-item class="form-item-select" label="姓名： ">
        <el-input v-model="searchForm.name" placeholder="请输入查询姓名" clearable></el-input>
      </el-form-item>


      <el-form-item class="form-item-btn one">
        <el-button class="btn" type="primary" @click="querySubmit" size="medium">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 内容表格 -->
    <el-table :data="list" border :header-cell-style="{background:'rgba(203,227,251,0.6)',color:'rgb(76,164,255)'}" height="660px">
      <el-table-column label="序号" align="center" width="50px">
      <template slot-scope="scope">{{scope.$index+1}}</template>
      </el-table-column>
      <!--<el-table-column prop="id" label="ID" align="center" width="40" ></el-table-column>-->

      <el-table-column prop="cardId" label="身份证号" align="center"  show-overflow-tooltip min-width="160"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="sex" label="性别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sex === '1'">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>
      <el-table-column prop="deviceid" label="设备编号" align="center"   min-width="120"></el-table-column>
      <!-- <el-table-column prop="business3" label="业务标识码3" align="center"></el-table-column> -->
      <!--<el-table-column prop="nation" label="民族" align="center"></el-table-column>-->

      <!--<el-table-column prop="birthday" label="生日" align="center"></el-table-column>-->
      <!--<el-table-column prop="address" label="地址" align="center"></el-table-column>-->
      <!-- <el-table-column prop="request" label="请求内容" align="center"></el-table-column> -->
      <!--<el-table-column prop="police" label="发证机关" align="center"></el-table-column>-->
      <!--<el-table-column prop="validStart" label="有效期始" align="center"></el-table-column>-->
      <!--<el-table-column prop="validEnd" label="有效期止" align="center"></el-table-column>-->
      <el-table-column prop="genType" label="业务大类" align="center" min-width="120">
        <template slot-scope="scope">
          <span >{{scope.row.genType | names(ywdl)}}</span>
<!--          <el-tag v-if="scope.row.genType === 1" effect="dark">拍照</el-tag>-->
<!--          <el-tag type="success" v-else-if="scope.row.genType === 2" effect="dark">受理</el-tag>-->
<!--          <el-tag type="info" v-else-if="scope.row.genType === 3" effect="dark">取证</el-tag>-->
<!--          <el-tag type="warning" v-else-if="scope.row.genType === 4" effect="dark">拍照受理一体</el-tag>-->
<!--          <el-tag type="danger" v-else effect="dark">其他拓展</el-tag>-->
          <!--<span ></span>-->
          <!--<span ></span>-->
          <!--<span ></span>-->
          <!--<span ></span>-->
          <!--<span ></span>-->
        </template>
      </el-table-column>
      <el-table-column prop="minorType" label="业务小类" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.minorType | names(ywxl)}}</span>


<!--          <span v-for="(item,index) in ywxl" >-->
<!--            <span v-if="item.code == scope.row.minorType"> {{item.name }} </span>-->
<!--          </span>-->

<!--          <span v-if="scope.row.minorType === 11" >到期</span>-->
<!--          <span v-else-if="scope.row.minorType === 12">损坏</span>-->
<!--          <span v-else-if="scope.row.minorType === 13">丢失</span>-->
<!--          <span v-else>{{scope.row.minorType}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="handleTime" label="办理时间" align="center"   min-width="150"></el-table-column>
      <el-table-column prop="isPay" label="是否缴费" align="center">
        <template slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.isPay === true"></i>
          <i class="el-icon-error" v-else></i>

          <!--<span >{{scope.row.isPay}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="payType" label="缴费方式" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.payType === 1" >微信</el-tag>
          <el-tag v-else-if="scope.row.payType === 2" type="success">支付宝</el-tag>
          <el-tag v-else-if="scope.row.payType === 3" type="danger">现金</el-tag>
          <el-tag v-else>其他</el-tag>


        </template>
      </el-table-column>
      <el-table-column prop="payAmount" label="缴费金额" align="center"></el-table-column>
      <el-table-column prop="handleResult" label="办理结果" align="center">
        <template slot-scope="scope">
          <!--<span v-if="scope.row.handleResult === 1">成功</span>-->
          <!--<span v-else>{{scope.row.handleResult}}</span>-->
          <i class="el-icon-success" v-if="scope.row.handleResult === 1"></i>
          <i class="el-icon-error" v-else></i>
        </template>
      </el-table-column>
      <el-table-column prop="handleDetails" label="结果说明" align="center" minWidth="100">
        <template slot-scope="scope">
          <!--<span v-if="scope.row.handleResult === 1">成功</span>-->
          <!--<span v-else>{{scope.row.handleResult}}</span>-->
          <el-tag v-if="scope.row.handleDetails === '成功'">成功办理</el-tag>
          <el-tag v-else type="success">{{scope.row.handleDetails}}</el-tag>
          <!--<i class="el-icon-success" v-if="scope.row.handleDetails === "></i>-->
          <!--<i class="el-icon-error" v-else></i>-->
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="上传时间" align="center"   min-width="150"></el-table-column>
      <!--<el-table-column prop="updatetime" label="修改时间" align="center"></el-table-column>-->
      <el-table-column prop="memo" label="备注" align="center" show-overflow-tooltip></el-table-column>
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
    name: "business",   // 业务数据查看
    data() {
      return {
        list: [],
        ywxl:[],
        ywdl:[],
        searchForm: {
          cardId: "",
          deviceid:"",
          genType:"",
          name:""
        },
        querySubmitForm: {
          cardId: "",
          deviceid:"",
          genType:"",
          name:""
        },
        lx:[
          { index:1 , label:"拍照" },
          { index:2 , label:"受理"},
          { index:3 , label:"取证"},
          { index:4 , label:"拍照受理一体机"}
        ],
        pagination: {
          total: 0, //总条数
          pageNo: 1, // 页数
          length: 8 // 每页的条数
        }, // 分页控件
        // 业务类型
        ywlx:{}
      };
    },
    methods: {
      // 获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/cardInfo/pages",
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
     // 获取业务
      getDataxiaol(){
        let that = this;
        request({
          url: "/sysParm",
          method: "get",
          params: {

            typeCode:'05'
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
      getDatadal(){
        let that = this;
        request({
          url: "/sysParm",
          method: "get",
          params: {

            typeCode:'04'
          }
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.ywdl = response.data.data;
              // that.list = response.data.data;
              // that.pagination.total = response.data.recordsTotal;
              console.log(response,333)
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 查询
      querySubmit() {
        let that = this;
        that.querySubmitForm = Object.assign({}, that.searchForm);
//        if(that.querySubmitForm.genType  === "拍照受理一体" ){ that.querySubmitForm.genType = 4  }
//        else if(that.querySubmitForm.genType  === "拍照" ){ that.querySubmitForm.genType = 1  }
//        else if(that.querySubmitForm.genType  === "受理" ){ that.querySubmitForm.genType = 2  }
//        else if(that.querySubmitForm.genType  === "取证" ){ that.querySubmitForm.genType = 3  }
//        else if(that.querySubmitForm.genType  === "" ){ that.querySubmitForm.genType = ""  }
//        else { that.querySubmitForm.genType = 5  }



        that.getData((that.pagination.pageNo = 1));
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
      //选择类型
      selectUnitName3(val) {
        // 当文本框内清除时  不会调用这个方法  解决了报错的问题
        if( val === null || val === "")  return;
//        console.log(val, '选中的id')
        let obj = {};
        obj = this.lx.find(item => {
          return item.index === val;
        });
//        this.editDialog.model.factorName = obj.name;
        this.searchForm.genType = obj.index;
        //console.log(obj.name, '选择的name')
      },
    },
    filters:{
      names(value, options){
        if (options.length == 0) return
        else {
          let newarr = options.filter((item,index,arr)=>{// item:循环结果 index:下标 arr:原数组
            return item.code == value;//判断即可
          })
          console.log(newarr)
          if (newarr.length == 0){
            return value
          }else {
            return newarr[0].name
          }
        }
      }
    },
    created() {
      this.getData();
      this.getDataxiaol();
      this.getDatadal();
    },
  };
</script>

<style scoped>
  .demo-form-inline {
    white-space: nowrap;
    width: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  .demo-form-inline > * {
    margin: 0;
    margin-right: 100px;
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
</style>
