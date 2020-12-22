<template>
  <div class="page-wrapper">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item class="form-item-select" label="设备编号：">
        <el-input v-model="searchForm.deviceid" clearable placeholder="请输入设备编号"></el-input>
      </el-form-item>
      <el-form-item class="form-item-btn one">
        <el-button class="btn" type="primary" @click="querySubmit" size="medium">查询</el-button>
      </el-form-item>
      <el-form-item class="form-item-btn two">
        <el-button class="btn" type="primary" @click="beginAdd" size="medium">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 内容表格 -->
    <el-table :data="list" border :header-cell-style="{background:'rgba(203,227,251,0.6)',color:'rgb(76,164,255)'}" height="660px">
      <el-table-column label="序号" align="center" width="50">
        <template slot-scope="scope">{{scope.$index+1}}</template>
      </el-table-column>
      <!--<el-table-column prop="id" label="ID" align="center"></el-table-column>-->
      <el-table-column  prop="deviceid" label="设备编号" align="center" minWidth="110" >
        <template slot-scope="scope">
          <el-popover placement="bottom" trigger="hover" width="300">
            <div class="look" >
              <div >

                <div style="float: left;width: 40%;display: inline-block;text-align: right">
                  设备所在经度：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  <span v-if="scope.row.longitude  === ''">正在更新，请稍后</span>
                  <span v-else>{{ scope.row.longitude }}</span>
                </div>
                <div style="float: left;width: 40%;display: inline-block;text-align: right">
                  设备所在纬度：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  <span v-if="scope.row.longitude  === ''">正在更新，请稍后</span>
                  <span v-else>{{ scope.row.latitude }}</span>
                </div>
                <div style="float: left;width: 40%;display: inline-block;text-align: right">
                  ip：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  <span v-if="scope.row.ip  === '' || scope.row.ip  === null">正在更新，请稍后</span>
                  <span v-else>{{ scope.row.ip }}</span>
                </div>
                <div style="float: left;width: 40%;display: inline-block;text-align: right">
                  mac：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  <span v-if="scope.row.mac  === ''">正在更新，请稍后</span>
                  <span v-else>{{ scope.row.mac }}</span>
                </div>
                <div style="float: left;width: 40%;display: inline-block;text-align: right">
                  创建时间：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  <span v-if="scope.row.createtime  === ''">正在更新，请稍后</span>
                  <span v-else>{{ scope.row.createtime }}</span>
                </div>
                <div style="float: left;width: 40%;display: inline-block;text-align: right">
                  修改时间：
                </div>
                <div style="float: right;display: inline-block;text-align: left;width: 60%">
                  <span v-if="scope.row.updatetime  === ''">正在更新，请稍后</span>
                  <span v-else>{{ scope.row.updatetime }}</span>
                </div>



              </div>
            </div>
            <el-badge is-dot class="item" slot="reference">
              <el-tag  class="curs">{{scope.row.deviceid}}</el-tag>
            </el-badge>

          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="unitName" label="放置单位" align="center" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="factorName" label="厂商" align="center" show-overflow-tooltip ></el-table-column>

      <el-table-column prop="areaCode" label="行政区划代号" align="center" minWidth="110"></el-table-column>
      <el-table-column prop="areaName" label="行政区划名称" align="center" minWidth="110" show-overflow-tooltip></el-table-column>
      <el-table-column prop="address" label="详细地址" align="center" minWidth="110" show-overflow-tooltip></el-table-column>
      <!--<el-table-column prop="longitude" label="经度" align="center" minWidth="50" show-overflow-tooltip></el-table-column>-->
      <!--<el-table-column prop="latitude" label="纬度" align="center" minWidth="50" show-overflow-tooltip></el-table-column>-->
      <el-table-column prop="version" label="软件版本号" align="center" show-overflow-tooltip></el-table-column>
      <!--<el-table-column prop="ip" label="ip" align="center" show-overflow-tooltip> </el-table-column>-->
      <!--<el-table-column prop="mac" label="mac" align="center" show-overflow-tooltip></el-table-column>-->
      <el-table-column prop="isEnable" label="是否可用" align="center" >
        <template slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.isEnable === 1"></i>
          <i class="el-icon-error" v-else></i>
        </template>
      </el-table-column>
      <el-table-column label="设备状态" align="center" min-width="120">
        <template slot-scope="scope">
          <span >{{scope.row.state | names(ywxl)}}</span>
<!--          <el-tag :type="{'info' : scope.row.state === 'ST010', 'info' : scope.row.state === 'ST020','danger' : scope.row.state === 'ST030'}">{{scope.row.state | names(ywxl)}}</el-tag>-->
<!--                    <span v-for="(item,index) in ywxl" >-->
<!--&lt;!&ndash;                      <span v-if="item.code == scope.row.state"> {{item.name }} </span>&ndash;&gt;-->
<!--                      <el-tag v-if="item.code == scope.row.state" type="success">在线</el-tag>-->
<!--&lt;!&ndash;                      <el-tag v-else-if="scope.row.state === 'ST020'" type="info">离线</el-tag>&ndash;&gt;-->
<!--&lt;!&ndash;                      <el-tag v-else type="danger">异常</el-tag>&ndash;&gt;-->
<!--                    </span>-->


  <!--          <el-tag v-if="scope.row.state === 'ST010'" type="success">在线</el-tag>-->
<!--          <el-tag v-else-if="scope.row.state === 'ST020'" type="info">离线</el-tag>-->
<!--          <el-tag v-else type="danger">异常</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column prop="devicetype" label="设备类型" align="center"  minWidth="100" >
        <template slot-scope="scope">
          <span >{{scope.row.devicetype | names(ywdl)}}</span>
<!--          <span v-if="scope.row.devicetype === 1">拍照</span>-->
<!--          <span v-else-if="scope.row.devicetype === 2">受理</span>-->
<!--          <span v-else-if="scope.row.devicetype === 3">取证</span>-->
<!--          <span v-else-if="scope.row.devicetype === 4">拍照受理一体</span>-->
<!--          <span v-else>其他拓展</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="activetime" label="活跃时间" align="center"  minWidth="150"></el-table-column>
      <!--<el-table-column prop="createtime" label="创建时间" align="center" show-overflow-tooltip></el-table-column>-->
      <!--<el-table-column prop="updatetime" label="修改时间" align="center" show-overflow-tooltip></el-table-column>-->
      <el-table-column prop="memo" label="备注" align="center" show-overflow-tooltip></el-table-column>

      <el-table-column label="操作" align="center" width="270">


        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="equipment(scope.row.id)" v-if="scope.row.isEnable === 1" >设备停用</el-button>
          <el-button size="mini" type="primary"  @click="equipment(scope.row.id)" v-else >设备启用</el-button>
          <el-button size="mini" type="primary" @click="beginUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="beginRemove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑对话框-->
    <el-dialog
      class="dialog-edit"
      :show-close="false"
      :close-on-click-model="false"
      :close-on-press-escape="false"
      :visible="editDialog.isShow"
      :title="`设备管理 - ${ editDialog.mode ? '新增' : '修改' }`"
      width="700px"
      top="5vh"
    >
      <!--用mode判断新增或修改，true表示新增，false表示修改-->
      <!--编辑对话框表单-->
      <el-form
        :model="editDialog.model"
        :rules="editDialog.rules"
        label-width="170px"
        ref="form"
      >
        <!--
        <el-form-item label="设备编号：" prop="deviceid">
            <el-input v-model="editDialog.model.deviceid" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        -->
        <el-form-item label="放置单位：" prop="unitName">
          <el-select v-model="editDialog.model.unitName" placeholder="请选择" @change="selectUnitName">
            <el-option v-for="item in unitlsts" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厂商：" prop="factorName">
          <el-select v-model="editDialog.model.factorName" placeholder="请选择" @change="selectUnitName2">
            <el-option v-for="item in unitlsts2" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备所在地行政区划：" prop="areaCode" v-model="editDialog.model.areaCode">
          <el-input prop="areaName" v-model="editDialog.model.areaName" style="display:none"></el-input>
          <section class="container" label="行政区划" style="height: 45px">
            <el-row>
              <el-select style="width: 142px" v-model="provinceValue" placeholder="请选择" @change="selectProvimce">
                <el-option v-for="(item,index) of provincearr" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <el-select style="width: 142px" v-model="cityValue" placeholder="请选择" @change="selectcity">
                <el-option v-for="(item,index) of cityarr" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <el-select style="width: 142px" placeholder="请选择" v-model="RegionValue" @change="selectRegion">
                <el-option v-for="(item,index) of regionarr" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-row>
          </section>
        </el-form-item>

        <el-form-item label="详细地址：" prop="address">
          <el-input v-model="editDialog.model.address" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="经度：" prop="longitude">
          <el-input v-model="editDialog.model.longitude" placeholder="请输入经度"></el-input>
        </el-form-item>
        <el-form-item label="纬度：" prop="latitude">
          <el-input v-model="editDialog.model.latitude" placeholder="请输入纬度"></el-input>
        </el-form-item>

        <el-form-item label="软件版本号：" prop="version">
          <!--
          <el-input v-model="editDialog.model.version" placeholder="请输入软件版本号"></el-input>
          -->
          <el-select v-model="editDialog.model.version" placeholder="请选择" filterable allow-create>
            <el-option v-for="item in softlsts" :key="item.version" :label="item.version" :value="item.version"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="ip：" prop="ip">
          <el-input v-model="editDialog.model.ip" placeholder="请输入ip"></el-input>
        </el-form-item>
        <el-form-item label="mac：" prop="mac">
          <el-input v-model="editDialog.model.mac" placeholder="请输入mac" @blur></el-input>
        </el-form-item>
        <el-form-item label="设备类型：" prop="devicetype">
          <el-select v-model="editDialog.model.devicetype" placeholder="请选择" @change="selectUnitName3">
            <el-option v-for="item in lx" :key="item.index" :label="item.label" :value="item.index"></el-option>
                <!--<el-option v-if="editDialog.model.devicetype === 1 " label=""> </el-option>-->
          </el-select>
          <!--<el-input v-model="editDialog.model.devicetype" placeholder="请输入设备类型" @blur></el-input>-->
        </el-form-item>
        <el-form-item label="备注：" prop="memo">
          <el-input v-model="editDialog.model.memo" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="是否可用：" prop="isEnable">
          <template>
            <el-radio v-model="editDialog.model.isEnable" :value="1" label="1">可用</el-radio>
            <el-radio v-model="editDialog.model.isEnable" :value="0" label="0">不可用</el-radio>
          </template>
        </el-form-item>

        <div v-show="showDInfo">
          <el-form-item label="设备编号：" prop="deviceid">
            <el-input v-model="editDialog.model.deviceid" readonly></el-input>
          </el-form-item>
          <el-form-item label="appid：" prop="appid">
            <el-input v-model="editDialog.model.appid" readonly></el-input>
          </el-form-item>
          <el-form-item label="secret：" prop="secret">
            <el-input v-model="editDialog.model.secret" readonly></el-input>
          </el-form-item>
        </div>
      </el-form>
      <!--编辑对话框底部按钮-->
      <div slot="footer">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="editDialog.isShow = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="dialog-edit"
      :show-close="false"
      :close-on-click-model="false"
      :close-on-press-escape="false"
      :visible="editDialog.isShow1"

      width="700px"
      top="35vh">
      <el-form
        :model="editDialog.model1"
        :rules="editDialog.rules"
        label-width="170px"
        ref="for"
      >
        <el-form-item label="请输入当前用户密码：" prop="password">
          <el-input v-model="editDialog.model1.password" placeholder="请输入当前用户密码"></el-input>
        </el-form-item>


      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="save1">确定</el-button>
        <el-button @click="editDialog.isShow1 = false">取消</el-button>
      </div>
    </el-dialog>
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
  import { province, map } from "@/assets/area";
  import { validater } from "@/utils/validater";

  export default {
    name: "facility",  // 设备信息管理
    data() {
      //let validateMac = (rule, value, callback) => {
      //    let temp = /[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}/;
      //    if (!temp.test(value)) {
      //        callback(new Error('请输入xx-xx-xx-xx-xx-xx形式的MAC地址！'));
      //    } else{
      //        callback();
      //    }
      //};
      return {
        //省市区start
        arr: [1, 3, 4],
        provincearr: [],
        map: [],
        cityarr: [],
        regionarr: [],
        provinceValue: "",
        cityValue: "",
        RegionValue: "",
        //省市区end
        softlsts: [],
        unitlsts: [],
        // 厂商
        unitlsts2:[],
        lx:[
          { index:1 , label:"拍照" },
          { index:2 , label:"受理" },
          { index:3 , label:"取证" },
          { index:4 , label:"拍照受理一体" },
          ],
        list: [],
        showDInfo: [],
        searchForm: {
          deviceid: ""
        },
        querySubmitForm: {
          deviceid: ""
        },
        pagination: {
          total: 0, //总条数
          pageNo: 1, // 页数
          length: 8 // 每页的条数
        }, // 分页控件
        editDialog: {
          isShow: false,
          isShow1:false,
          mode: true,
          id: 0,
          model: {
            // deviceid: "",
            areaCode: "",
            areaName: "",
            address: "",
            longitude: "",
            latitude: "",
            version: "",
            ip: "",
            mac: "",
            state: "",
            memo: "",
            factorName:"",
            unitName: "",
            appid: "",
            secret: "",
            unitId: "",
            factorId: "",
            devicetype:"",
            isEnable:"1",
          },
          model1:{
            password:"",
            id:""
          },
          rules: {
            // 表单验证
            areaCode: [
              {
                required: true,
                message: "行政区划代号不能为空",
                trigger: "blur"
              }
            ],
            password: [
              {
                required: true,
                message: "当前用户密码不能为空",
                trigger: "blur"
              }
            ],
            areaName: [
              {
                required: true,
                message: "行政区划名称不能为空",
                trigger: "blur"
              }
            ],
            address: [
              {
                required: true,
                message: "详细地址不能为空",
                trigger: "blur"
              }
            ],
            ip: [
              {
                request: false,
                validator: validater.ipAddress,
                trigger: "blur"
              }
            ],
            mac: [
              {
                required: true,
                //message: "mac不能为空",
                validator: validater.validateMac,
                trigger: "blur"
              }
            ],
            unitName: [
              {
                required: true,
                message: "放置单位不能为空",
                trigger: "blur"
              }
            ],
            factorName: [
              {
                required: true,
                message: "厂商不能为空",
                trigger: "blur"
              }
            ],
            devicetype: [
              {
                required: true,
                message: "设备类型不能为空",
                trigger: "blur"
              }
            ],
            longitude: [
              {
                required: true,
//                message: "经度不能为空",
                validator: validater.checkLongitude,
                trigger: "blur"
              }
            ],
            latitude: [
              {
                required: true,
//                message: "纬度不能为空",
                validator: validater.checkLatitude,
                trigger: "blur"
              }
            ],
          }
        },
        ywxl:[],
        ywdl:[],
      };
    },
    methods: {
      //选择省
      // 获取业务
      getDataxiaol(){
        let that = this;
        request({
          url: "/sysParm",
          method: "get",
          params: {

            typeCode:'03'
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
      selectProvimce(id) {
        this.cityarr = [];
        this.regionarr = [];
        this.cityValue = "";
        this.RegionValue = "";
        for (let item of this.provincearr) {
          if (id == item.id) {
            console.log(item);
            this.cityarr = item.children;
            //console.log(this.cityarr, '市')
            this.editDialog.model.areaName = item.name;
          }
        }
        this.editDialog.model.areaCode = this.provinceValue;
        //console.log(this.editDialog.model.areaCode,'areaCode')
        //console.log(this.editDialog.model.areaName,'areaName')
      },
      //选择市
      selectcity(id) {
        this.regionarr = [];
        this.RegionValue = "";
        for (let item of this.cityarr) {
          if (id == item.id) {
            this.regionarr = item.children;
            this.editDialog.model.areaName += item.name;
          }
        }
        this.editDialog.model.areaCode = this.cityValue;
        //console.log(this.editDialog.model.areaCode,'area_code')
        //console.log(this.editDialog.model.areaName,'areaName')
      },
      //选择区
      selectRegion(id) {
        for (let item of this.regionarr) {
          if (id == item.id) {
            this.editDialog.model.areaName += item.name;
            //console.log(item.id,'ID')
            //console.log(item.name,'区')
          }
        }
        this.editDialog.model.areaCode = this.RegionValue;
        //console.log(this.editDialog.model.areaCode,'area_code')
        //console.log(this.editDialog.model.areaName,'areaName')
      },
      //获取软件版本列表
      getSoftList() {
        let that = this;
        request({
          url: "/sysSoftware",
          method: "get",
          params: {}
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.softlsts = response.data.data;
              //console.log(that.softlsts, "软件列表");
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      //获取单位列表
      getUnitList() {
        let that = this;
        request({
          url: "/sysUnit",
          method: "get",
          params: {}
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              for(var i = 0 ; i< response.data.data.length;i++ ){
                if(response.data.data[i].category  === "D" ){
                  that.unitlsts.push(response.data.data[i])
                  // console.log(that.unitlsts)
                }
                else if(response.data.data[i].category  === "F"){
                  that.unitlsts2.push(response.data.data[i])
                  // console.log(that.unitlsts2)
                }
              }
//              that.unitlsts = response.data.data;
//              console.log(that.unitlsts, "单位列表")

            }
          })
          .catch(function(error) {
            console.log(error, "保存信息");
          });
      },
      //选择单位名称
      selectUnitName(val) {
        //console.log(val, '选中的id')
        let obj = {};
        obj = this.unitlsts.find(item => {
          return item.id === val;
        });
        this.editDialog.model.unitName = obj.name;
        this.editDialog.model.unitId = obj.id;
        //console.log(obj.name, '选择的name')
      },
      //选择厂商
      selectUnitName2(val) {
        //console.log(val, '选中的id')
        let obj = {};
        obj = this.unitlsts2.find(item => {
          return item.id === val;
        });
        this.editDialog.model.factorName = obj.name;
        this.editDialog.model.factorId = obj.id;
        //console.log(obj.name, '选择的name')
      },
      //选择类型
      selectUnitName3(val) {
        // console.log(val, '选中的id')
        let obj = {};
        obj = this.lx.find(item => {
          return item.index === val;
        });
//        this.editDialog.model.factorName = obj.name;
        this.editDialog.model.devicetype = obj.index;
        //console.log(obj.name, '选择的name')
      },

      // 获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/sysDevice/pages",
          method: "get",
          params: {
            ...that.querySubmitForm,
            length: that.pagination.length,
            pageNo: that.pagination.pageNo,
            date: Date.parse(new Date())
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

      // 新增
      beginAdd() {
        this.editDialog.mode = true;
        this.showDInfo = false;
        this.editDialog.isShow = true;
      },
      // 修改
      beginUpdate(row) {
        console.log(row);

        this.editDialog.id = row.id;
        this.editDialog.model.deviceid = row.deviceid;
        this.editDialog.model.areaCode = row.areaCode;
        this.editDialog.model.areaName = row.areaName;
        this.editDialog.model.address = row.address;
        this.editDialog.model.longitude = row.longitude;
        this.editDialog.model.latitude = row.latitude;
        this.editDialog.model.version = row.version;
        this.editDialog.model.ip = row.ip;
        this.editDialog.model.mac = row.mac;
        this.editDialog.model.state = row.state;
        this.editDialog.model.memo = row.memo;
        this.editDialog.model.unitName = row.unitName;
        this.editDialog.model.appid = row.appid;
        this.editDialog.model.secret = row.secret;
        this.editDialog.model.factorName = row.factorName;
        this.editDialog.model.unitId = row.unitId;
        this.editDialog.model.factorId = row.factorId;
        this.editDialog.model.devicetype = row.devicetype;
        this.editDialog.model.isEnable = row.isEnable + "";

        //省市区
        this.provinceValue = row.areaCode.substring(0, 2) + "0000"; //370000
        //this.cityValue = row.areaCode.substring(0,4)+"00"; //370200
        //this.RegionValue = row.areaCode; //370202
        this.cityValue = map[row.areaCode.substring(0, 4) + "00"]; //map["110100"]
        console.log(this.cityValue, "市");
        this.RegionValue = map[row.areaCode];
        console.log(this.RegionValue, "区");

        //let arrArea = row.areaName.split("市"); //根据市截取字符串
        //console.log(arrArea,'arrArea');
        ////arrArea = this.trimNull(arrArea);
        ////console.log(arrArea,'arrArea2');
        //let ctyVal = row.areaName.indexOf("省") >= 0?(row.areaName.split("省")[1].split("市")[0]+"市"):(arrArea[arrArea.length-2].split("市")[0]+"市")
        //console.log(ctyVal, '市')
        //this.cityValue = ctyVal;
        //this.RegionValue = arrArea[arrArea.length-1];
        //console.log(this.RegionValue, '区')

        this.editDialog.mode = false;
        this.showDInfo = true;
        this.editDialog.isShow = true;
      },

     /* trimNull(array) {
        for (var i = 0; i < array.length; i++) {
          if (
            array[i] == " " ||
            array[i] == "" ||
            array[i] == null ||
            typeof array[i] == "undefined"
          ) {
            array.splice(i, 1);
            i = i - 1;
          }
        }
        return array;
      },*/

      // 设备启动与停用
      equipment(id){
        let that = this;

        request({
          url: `/sysDevice/${id}`,
          method: "post",
          params: {

            // date: Date.parse(new Date())
          }
        })
          .then(function(response) {
            // console.log(response,'返回值')
            if (response.data.code === 20000) {
//              if(that.editDialog.isEnable === 1) {}
              that.$onces({
                type: "success",
                message: "设备状态更改成功"
              });
              that.getData();
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 保存
      save() {

        this.$refs.form
          .validate()
          .then(() => {
            if (this.editDialog.mode) {
              // 新增
              let that = this;
              request({
                url: "/sysDevice/save",
                method: "post",
                data: {
                  ...that.editDialog.model
                  // date: Date.parse(new Date())
                }
              })
                .then(function(response) {
                  //console.log(response,'返回值')
                  if (response.data.code === 20000) {
                    that.editDialog.isShow = false;
                    that.$message({
                      type: "success",
                      message: "新增成功"
                    });
                    that.getData();
                  }
                })
                .catch(function(error) {
                  console.log(error, "报错信息");
                });
            } else {

              // 修改

              let that = this;
              request({
                url: "/sysDevice/save",
                method: "post",
                data: {
                  ...that.editDialog.model,
                  id: that.editDialog.id,

                  // date: Date.parse(new Date())
                }
              })
                .then(function(response) {
                  if (response.data.code === 20000) {
                    that.editDialog.isShow = false;
                    that.$message({
                      type: "success",
                      message: "修改成功"
                    });
                    that.getData();
                  }
                })
                .catch(function(error) {
                  console.log(error, "报错信息");
                });
            }
          })
          .catch(() => {});
      },
      // 删除
      save1(){
        let that = this;
         let id = that.editDialog.model1.id;
              request({
              url: `/sysDevice/dev/${id}`,
              method: "delete",
              params: {
                  password:that.editDialog.model1.password
//                  ...that.editDialog.model1,

                }
            })
              .then(function(response) {
                if (response.data.code === 20000) {
                  that.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  that.editDialog.isShow1 = false;
                  that.getData();
                }
              })
              .catch(function(error) {
                console.log(error, "报错信息");
              });
      },
      // 删除弹框
      beginRemove(id) {
        // let data = { id, date: Date.parse(new Date()) };
        this.$confirm("确定要删除此条记录？", "提示", {
          showClose: false,
          type: "warning"
        })
          .then(() => {
            let that = this;
            that.editDialog.isShow1 = true;
            that.editDialog.model1.id = id;
          })
          .catch(() => {});
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
      }
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
      },
      namess(value, options){
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
      },
    },
    watch: {
      "editDialog.isShow"(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.$refs.form.resetFields();
          this.editDialog.id = 0;
          this.editDialog.model.deviceid = "";
          this.editDialog.model.areaCode = "";
          this.editDialog.model.areaName = "";
          this.editDialog.model.address = "";
          this.editDialog.model.longitude = "";
          this.editDialog.model.latitude = "";
          this.editDialog.model.version = "";
          this.editDialog.model.ip = "";
          this.editDialog.model.mac = "";
          this.editDialog.model.state = "";
          this.editDialog.model.memo = "";
          this.editDialog.model.unitName = "";
          this.editDialog.model.unitId = "";
          this.editDialog.model.factorName = "";
          this.editDialog.model.appid = "";
          this.editDialog.model.secret = "";
          this.editDialog.model.factorId = "";
          this.editDialog.model.devicetype = "";
          this.editDialog.model.isEnable = "1";
          //清空省市区
          this.provinceValue = "";
          this.cityValue = "";
          this.RegionValue = "";
          this.cityarr = [];
          this.regionarr = [];
        }
      }
    },
    created() {
      this.getData();
      this.getDataxiaol();
      this.getDatadal();
      this.provincearr = province;
    },
    mounted() {
      this.getSoftList();
      this.getUnitList();
    }
  };
</script>

<style scoped>
  .container {
    width: 100%;
    height: 40px;
    overflow: auto;
  }
  .el-row {
    white-space: nowrap;
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
    text-align: center;

    height: 90px;
    flex-shrink: 0;
  }
  .el-icon-edit-outline {
    background-color: #409eff;
    color: #ffffff;
    font-size: 24px;
  }
  .el-icon-delete {
    background-color: #f56c6c;
    color: #ffffff;
    font-size: 24px;
  }
  .el-tooltip {
    border-radius: 50%;
    padding: 5px;
    margin: 0 10px;
  }
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
    margin-right: 50px;
  }
  .btn{
    width: 80px;
  }
  .form-item-btn {
    width: calc((96% - 285px) / 2);
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
