<template>
  <div class="page-wrapper">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item class="form-item-select" label="类别代码：">
<!--        <el-input v-model="searchForm.typeCode"  placeholder="请输入类别代码"  clearable></el-input>-->
        <el-select v-model="searchForm.typeCode" placeholder="请选择单位类型" @change="selectUnitName5" clearable>
          <el-option v-for="item in lx" :key="item.index" :label="item.label" :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-item-select" label="类别名称：">
        <el-input v-model="searchForm.typeName"  placeholder="请输入类别名称"  clearable></el-input>
      </el-form-item>
      <el-form-item class="form-item-select" label="参数代码：">
        <el-input v-model="searchForm.code"  placeholder="请输入参数代码"  clearable></el-input>
      </el-form-item>
      <el-form-item class="form-item-select" label="参数名称：">
        <el-input v-model="searchForm.name"  placeholder="请输入参数名称"  clearable></el-input>
      </el-form-item>

      <el-form-item label="是否启用：" class="form-item-select">
        <el-select v-model="searchForm.isEnable" placeholder="请选择是否启用" @change="selectUnitName6" clearable>
          <el-option v-for="item in lx1" :key="item.index" :label="item.label" :value="item.index" ></el-option>
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
      <el-table-column prop="typeCode" label="类别代码" align="center" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.typeCode === '01'" >设备组件代码</el-tag>
          <el-tag v-else-if="scope.row.typeCode === '02'" type="success">设备类型</el-tag>
          <el-tag v-else-if="scope.row.typeCode === '03'" type="info" >设备运行状态</el-tag>
          <el-tag v-else-if="scope.row.typeCode === '04'" type="warning">业务大类</el-tag>
          <el-tag v-else-if="scope.row.typeCode === '05'" style="color: blueviolet">业务小类</el-tag>
          <el-tag v-else type="danger">缴费方式</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="typeName" label="类别名称" align="center" minWidth="50px" ></el-table-column>
      <el-table-column prop="code" label="参数代码" align="center" minWidth="50px" ></el-table-column>
      <el-table-column prop="name" label="参数名称" align="center"></el-table-column>
      <el-table-column prop="value" label="参数值" align="center" minWidth="120"></el-table-column>
      <el-table-column prop="isEnable" label="是否启用"  align="center">
        <template slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.isEnable === 1"></i>
          <i class="el-icon-error" v-else></i>
          <!--<span v-if="scope.row.result === 1">成功</span>-->
          <!--<span v-else>{{scope.row.result}}</span>-->
        </template>
      </el-table-column>

      <el-table-column prop="createtime" label="创建时间" align="center" minWidth="130"></el-table-column>
      <el-table-column prop="updatetime" label="更新时间" align="center" minWidth="130"></el-table-column>
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
      :title="`参数 - ${ editDialog.mode ? '新增' : '修改' }`"
      width="650px"
    >
      <!--用mode判断新增或修改，true表示新增，false表示修改-->
      <!--编辑对话框表单-->
      <el-form :model="editDialog.model" :rules="editDialog.rules" label-width="170px" ref="form">
        <el-form-item label="单位类型：" prop="typeCode">
          <el-select v-model="editDialog.model.typeCode" placeholder="请选择类别代码" @change="selectUnitName3">
            <el-option v-for="item in lx" :key="item.index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别名称：" prop="typeName">
          <el-input v-model="editDialog.model.typeName" placeholder="请输入类别名称"></el-input>
        </el-form-item>

        <el-form-item label="参数代码：" prop="code">
          <el-input v-model="editDialog.model.code" placeholder="请输入参数代码"></el-input>
        </el-form-item>
        <el-form-item label="参数值：" prop="value">
          <el-input v-model="editDialog.model.value" placeholder="请输入参数值"></el-input>
        </el-form-item>
        <el-form-item label="参数名称：" prop="name">
          <el-input v-model="editDialog.model.name" placeholder="请输入参数名称"></el-input>
        </el-form-item>
        <el-form-item label="是否可用：" prop="isEnable">
          <template>
            <el-radio v-model="editDialog.model.isEnable" :value="1" label="1">可用</el-radio>
            <el-radio v-model="editDialog.model.isEnable" :value="0" label="0">不可用</el-radio>
          </template>
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
  export default {
    name: "parameter",  // 参数管理
    data() {
      return {
        lx:[
          { index:1 , label:"设备组件代码",value:"01" },
          { index:2 , label:"设备类型",value: "02" },
          { index:3 , label:"设备运行状态",value: "03" },
          { index:4 , label:"业务大类",value: "04" },
          { index:5 , label:"业务小类",value: "05" },
          { index:6 , label:"缴费方式",value: "06" },
        ],
        lx1:[
          { index:1 , label:"启动" },
          { index:0 , label:"禁用" },
        ],
        list: [],
        searchForm: {
          typeCode: "",
          typeName:"",
          code:"",
          name:"",
          isEnable:"",

        },
        querySubmitForm: {
          typeCode: "",
          typeName:"",
          code:"",
          name:"",
          isEnable:"",
        },
        pagination: {
          total: 0, //总条数
          pageNo: 1, // 页数
          length: 8 // 每页的条数
        }, // 分页控件
        editDialog: {
          isShow: false,
          mode: true,
          model: {
            id:0,
            name: "",
            typeCode: "",
            typeName: "",
            code: "",
            value: "",
            isEnable:"1",
            memo:"",
          },
          rules: {
            // 表单验证
            typeCode: [
              {
                required: true,
                message: "类别代码不能为空",
                trigger: "blur"
              }
            ],
            name: [
              {
                required: true,
                message: "参数名称不能为空",
                trigger: "blur"
              }
            ],
            typeName: [
              {
                required: true,
                message: "类别名称不能为空",
                trigger: "blur"
              }
            ],
            code: [
              {
                required: true,
                message: "参数代码不能为空",
                trigger: "blur"
              }
            ],
            isEnable: [
              {
                required: true,
                message: "不能为空",
                trigger: "blur"
              }
            ],
            value: [
              {
                required: true,
                message: "参数值不能为空",
                trigger: "blur"
              }
            ],
          }
        }
      };
    },
    methods: {
      // 新增类别代码
      selectUnitName3(val) {
       console.log(val, '选中的id')
        if(val != null) return
        let obj = {};
        obj = this.lx.find(item => {
          return item.value === val;
        });
//        this.editDialog.model.factorName = obj.name;
        this.editDialog.model.typeCode = obj.value;
        //console.log(obj.name, '选择的name')
      },
      // 类别代码
      selectUnitName5(val) {
       console.log(val, '选中的id')
        if(val != null) return
        let obj = {};
        obj = this.lx.find(item => {
          return item.value === val;
        });
//        this.editDialog.model.factorName = obj.name;
        this.searchForm.typeCode = obj.value;
        //console.log(obj.name, '选择的name')
      },
      selectUnitName6(val) {
       console.log(val, '选中的id')
        if(val != null) return
        let obj = {};
        obj = this.lx.find(item => {
          return item.index === val;
        });
//        this.editDialog.model.factorName = obj.name;
        this.searchForm.isEnable = obj.index;
        //console.log(obj.name, '选择的name')
      },
      // 获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/sysParm",
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

        this.editDialog.model.id = row.id;
        this.editDialog.model.typeCode = row.typeCode;
        this.editDialog.model.typeName = row.typeName;
        this.editDialog.model.code = row.code;
        this.editDialog.model.name = row.name;
        this.editDialog.model.value = row.value;
        this.editDialog.model.isEnable = row.isEnable + "";
        this.editDialog.model.memo = row.memo;

        this.editDialog.mode = false;
        this.editDialog.isShow = true;
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
                url: "/sysParm",
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
            } else {
              // 修改
              console.log(1);
              let that = this;
              request({
                url: "/sysParm",
                method: "put",
                data: {
                  id: that.editDialog.model.id,
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
              url: `/sysParm/${id}`,
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
          this.editDialog.model.typeCode = "";
          this.editDialog.model.typeName = "";
          this.editDialog.model.code = "";
          this.editDialog.model.value = "";
          this.editDialog.model.isEnable = "1";
          this.editDialog.model.memo = "";
          this.editDialog.model.name = "";


        }
      }
    },
    created() {
      this.getData();

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
    justify-content: space-around;
    align-items: center;
    display: flex;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  .demo-form-inline > * {
    margin: 0;
    margin-right: 110px;
  }
  .form-item-btn {
    width: calc((96% - 600px) / 5);
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
  .el-icon-success{ color: rgb(102,177,255);font-size: 18px; }
  .el-icon-error{ color: red;font-size: 18px; }
</style>
