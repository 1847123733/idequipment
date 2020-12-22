<template>
  <div class="page-wrapper">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item class="form-item-select" label="单位名称：">
        <el-input v-model="searchForm.name"  placeholder="请输入单位名称"  clearable></el-input>
      </el-form-item>

      <el-form-item label="单位类型：" class="form-item-select">
        <el-select v-model="searchForm.category" placeholder="请选择单位类型" @change="selectUnitName5" clearable>
          <el-option v-for="item in lx" :key="item.index" :label="item.label" :value="item.dw" ></el-option>
        </el-select>
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
      <el-table-column label="序号" align="center" minWidth="50px">
        <template slot-scope="scope">{{scope.$index+1}}</template>
      </el-table-column>
      <!--<el-table-column prop="id" label="ID" align="center" v-if="false"></el-table-column>-->
      <el-table-column prop="category" label="单位类型" align="center" min-width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.category === 'D'" >放置单位</el-tag>
          <el-tag v-else-if="scope.row.category === 'F'" type="success">厂家方</el-tag>
          <el-tag  v-else type="warning">管理单位</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="单位名称" align="center" minWidth="150px" >
        <template slot-scope="scope">
          <el-popover placement="top" trigger="hover" title="基本信息">
            <div class="look">
              <div>
                经度：{{ scope.row.longitude }}
              </div>
              <div>纬度：{{ scope.row.latitude }}</div>

              <div>单位负责人：{{ scope.row.leader}}</div>

              <div>单位负责人联系方式：{{ scope.row.leaderTel }}</div>
            </div>
            <el-badge is-dot class="item" slot="reference">
              <el-tag >{{scope.row.name}}</el-tag>
<!--              <el-button class="share-button" icon="el-icon-share" type="primary"></el-button>-->
            </el-badge>

          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="areaCode" label="区划代码" align="center"></el-table-column>
      <el-table-column prop="areaName" label="区划名称" align="center" minWidth="120"></el-table-column>
      <el-table-column prop="address" label="单位地址" show-overflow-tooltip align="center"></el-table-column>
      <!--<el-table-column prop="longitude" label="经度"></el-table-column>-->
      <!--<el-table-column prop="latitude" label="纬度"></el-table-column>-->
      <!--<el-table-column prop="leader" label="单位负责人"></el-table-column>-->
      <el-table-column prop="power" label="查看权限" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.power === null" v-cloak>
            <el-tag   type="danger" effect="dark">本单位</el-tag>
            <!--暂无权限-->
          </div>
          <div v-else>
            <div v-if="scope.row.category === 'D'">
              <el-tag   type="danger" effect="dark">本单位</el-tag>
              <!--暂无权限-->
            </div>
            <div v-else-if="scope.row.category === 'F'">
              <el-tag   type="danger" effect="dark">本单位</el-tag>
              <!--暂无权限-->
            </div>
            <div v-else>
              <span v-if="scope.row.power === 1" ></span>
              <el-tag v-else-if="scope.row.power === 2"  effect="dark">省级权限</el-tag>
              <el-tag v-else-if="scope.row.power === 3" type="success" effect="dark">市级权限</el-tag>
              <el-tag  v-else-if="scope.row.power === 4" type="warning" effect="dark">区级权限</el-tag>
              <el-tag  v-else type="danger" effect="dark">本单位</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间" align="center" minWidth="100"></el-table-column>
      <el-table-column prop="updatetime" label="更新时间" align="center" minWidth="100"></el-table-column>
      <el-table-column prop="memo" label="备注" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
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
      :title="`单位 - ${ editDialog.mode ? '新增' : '修改' }`"
      width="650px"
      top="5vh"
    >
      <!--用mode判断新增或修改，true表示新增，false表示修改-->
      <!--编辑对话框表单-->
      <el-form :model="editDialog.model" :rules="editDialog.rules" label-width="170px" ref="form">
        <el-form-item label="单位类型：" prop="category">
          <el-select v-model="editDialog.model.category" placeholder="请选择" @change="selectUnitName3">
            <el-option v-for="item in lx" :key="item.index" :label="item.label" :value="item.dw"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查看权限：" prop="power" v-if="editDialog.model.category === 'M'">
          <el-select v-model="editDialog.model.power" placeholder="请选择" @change="selectUnitName4">
            <el-option v-for="item in lx1" :key="item.index" :label="item.label" :value="item.index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称：" prop="name">
          <el-input v-model="editDialog.model.name" placeholder="请输入单位名称"></el-input>
        </el-form-item>
        <el-form-item label="行政区划：" prop="areaCode" v-model="editDialog.model.areaCode">
          <el-input prop="areaName" v-model="editDialog.model.areaName" style="display:none"></el-input>
          <section class="container" label="行政区划" style="height: 45px">
            <el-row>
              <el-select
                style="width: 142px"
                v-model="provinceValue"
                placeholder="请选择"
                @change="selectProvimce"
              >
                <el-option
                  v-for="(item,index) of provincearr"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                style="width: 142px"
                v-model="cityValue"
                placeholder="请选择"
                @change="selectcity"
              >
                <el-option
                  v-for="(item,index) of cityarr"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                style="width: 142px"
                placeholder="请选择"
                v-model="RegionValue"
                @change="selectRegion"
              >
                <el-option
                  v-for="(item,index) of regionarr"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-row>
          </section>
        </el-form-item>
        <el-form-item label="单位地址：" prop="address">
          <el-input v-model="editDialog.model.address" placeholder="请输入单位详细地址"></el-input>
        </el-form-item>
        <el-form-item label="经度：" prop="longitude">
          <el-input v-model="editDialog.model.longitude" placeholder="请输入经度"></el-input>
        </el-form-item>
        <el-form-item label="纬度：" prop="latitude">
          <el-input v-model="editDialog.model.latitude" placeholder="请输入纬度"></el-input>
        </el-form-item>
        <el-form-item label="负责人：" prop="leader">
          <el-input v-model="editDialog.model.leader" placeholder="请输入负责人姓名"></el-input>
        </el-form-item>
        <el-form-item label="负责人电话：" prop="leaderTel">
          <el-input v-model="editDialog.model.leaderTel" placeholder="请输入负责人电话"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="memo">
          <el-input v-model="editDialog.model.memo" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <!--编辑对话框底部按钮-->
      <div slot="footer">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="editDialog.isShow = false">取消</el-button>
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
    name: "units",  // 单位管理
    data() {
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
        lx:[
          { index:1 , label:"放置单位" ,dw:"D"},
          { index:2 , label:"厂家方",dw:"F" },
          { index:3 , label:"管理单位",dw:"M" }
        ],
//      { index:1 , label:"全部" },
        lx1:[

          { index:2 , label:"省级" },
          { index:3 , label:"市级" },
          { index:4 , label:"区级" },
          { index:5 , label:"本单位" },
        ],
        list: [],
        searchForm: {
          category: "",
          name:""

        },
        querySubmitForm: {
          category: "",
          name:""
        },
        pagination: {
          total: 0, //总条数
          pageNo: 1, // 页数
          length: 8 // 每页的条数
        }, // 分页控件
        editDialog: {
          isShow: false,
          mode: true,
          id: 0,
          model: {
            name: "",
            areaCode: "",
            areaName: "",
            address: "",
            longitude: "",
            latitude: "",
            leader: "",
            leaderTel: "",
            memo: "",
            category:"",
            power:""
          },
          rules: {
            // 表单验证
            category: [
              {
                required: true,
                message: "单位类别不能为空",
                trigger: "blur"
              }
            ],
            name: [
              {
                required: true,
                message: "单位名称不能为空",
                trigger: "blur"
              }
            ],
            areaCode: [
              {
                required: true,
                message: "行政区划代号不能为空",
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
                message: "单位详细地址不能为空",
                trigger: "blur"
              }
            ],
/*
            leader: [
              {
                required: true,
                message: "负责人姓名不能为空",
                trigger: "blur"
              }
            ],*/
            power: [
              {
                required: true,
                message: "权限不能为空",
                trigger: "blur"
              }
            ],
            leaderTel: [
              {
                validator: (rule, value, callback) => {
                  if (value === "") callback()
                  else if (!/^1[3456789]\d{9}$/.test(value))
                    callback(new Error("请输入正确的手机号码"));
                  else callback();
                },
                trigger: "blur",
                required: false,

              }
            ]
          }
        }
      };
    },
    methods: {
      //选择省
      selectProvimce(id) {
        this.cityarr = [];
        this.regionarr = [];
        this.cityValue = "";
        this.RegionValue = "";
        for (let item of this.provincearr) {
          if (id == item.id) {
//            console.log(item);
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
      //选择类型
      selectUnitName3(val) {
//        console.log(val, '选中的id')
        let obj = {};
        obj = this.lx.find(item => {
          return item.dw === val;
        });
        console.log(obj);
//        this.editDialog.model.factorName = obj.name;
        this.editDialog.model.category = obj.dw;
        //console.log(obj.name, '选择的name')
      },
      selectUnitName4(val) {
//        console.log(val, '选中的id')
        let obj = {};
        obj = this.lx1.find(item => {
          return item.index === val;
        });
//        this.editDialog.model.factorName = obj.name;
        this.editDialog.model.power = obj.index;
        //console.log(obj.name, '选择的name')
      },
      selectUnitName5(val) {
//        console.log(val, '选中的id')
        if(val != null) return
        let obj = {};
        obj = this.lx.find(item => {
          return item.dw === val;
        });
//        this.editDialog.model.factorName = obj.name;
        this.searchForm.category = obj.dw;
        //console.log(obj.name, '选择的name')
      },
      // 获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/sysUnit/pages",
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
        this.editDialog.isShow = true;
      },
      // 修改
      beginUpdate(row) {
        this.editDialog.id = row.id;
        this.editDialog.model.category = row.category;
        this.editDialog.model.power = row.power;
        this.editDialog.model.name = row.name;
        this.editDialog.model.areaCode = row.areaCode;
        this.editDialog.model.areaName = row.areaName;
        this.editDialog.model.address = row.address;
        this.editDialog.model.longitude = row.longitude;
        this.editDialog.model.latitude = row.latitude;
        this.editDialog.model.leader = row.leader;
        this.editDialog.model.leaderTel = row.leaderTel;
        this.editDialog.model.memo = row.memo;


        //省市区
        this.provinceValue = row.areaCode.substring(0, 2) + "0000"; //370000
        console.log(this.provinceValue, "省");
        //this.cityValue = row.areaCode.substring(0,4)+"00"; //370200
        //this.RegionValue = row.areaCode; //370202
       this.cityValue = map[row.areaCode.substring(0, 4) + "00"]; //map["110100"]
        console.log(this.cityValue, "市");
        this.RegionValue = map[row.areaCode];
        console.log(this.RegionValue, "区");

        this.editDialog.mode = false;
        this.editDialog.isShow = true;
      },
      // 好像没有什么用
      /*trimNull(array) {
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
      // 保存
      save() {
        this.$refs.form
          .validate()
          .then(() => {
            if (this.editDialog.mode) {
              // 新增
              let that = this;
              request({
                url: "/sysUnit",
                method: "post",
                data: {
                  ...that.editDialog.model
                  // date: Date.parse(new Date())
                }
              })
                .then(function(response) {
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
            }
            else {
              // 修改
              let that = this;
              request({
                url: "/sysUnit",
                method: "put",
                data: {
                  id: that.editDialog.id,
                  ...that.editDialog.model
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
      beginRemove(id) {
        // let data = { id, date: Date.parse(new Date()) };
        this.$confirm("确定要删除此条记录？", "提示", {
          showClose: false,
          type: "warning"
        })
          .then(() => {
            let that = this;
            request({
              url: `/sysUnit/${id}`,
              method: "delete"
            })
              .then(function(response) {
                if (response.data.code === 20000) {
                  that.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  that.getData();
                }
              })
              .catch(function(error) {
                console.log(error, "报错信息");
              });
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
    watch: {
      "editDialog.isShow"(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.$refs.form.resetFields();
          this.editDialog.id = 0;
          this.editDialog.model.category = "";
          this.editDialog.model.name = "";
          this.editDialog.model.areaCode = "";
          this.editDialog.model.areaName = "";
          this.editDialog.model.address = "";
          this.editDialog.model.longitude = "";
          this.editDialog.model.latitude = "";
          this.editDialog.model.leader = "";
          this.editDialog.model.leaderTel = "";
          this.editDialog.model.memo = "";
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
      this.provincearr = province;
      // console.log(this.provincearr)
    }
  };
</script>

<style scoped>
  [v-cloak]{ display: none }
  .page-wrapper {
    height: 100%;
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
  .form-item-btn {
    width: calc((96% - 600px) / 2);
  }
  .form-item-btn.one {
    text-align: left;
  }
  .form-item-btn.two {
    text-align: right;
  }
  .btn{
    width: 80px;
  }
  .item {
    margin-top: 5px;

  }
</style>
