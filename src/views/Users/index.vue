<template>
  <div class="page-wrapper">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item class="form-item-select" label="账号：">
        <el-input clearable v-model="searchForm.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item class="form-item-btn one">
        <el-button class="btn" type="primary" @click="querySubmit" size="medium">查询</el-button>
      </el-form-item>
      <el-form-item class="form-item-btn two">
        <el-button class="btn" type="primary" @click="beginAdd" size="medium">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 内容表格 -->
    <!--:header-cell-style="{background:'rgb(203,227,251)',color:'rgb(76,164,255)'}"-->
<!--    : ="{background:'#C0C8D5',color:'black'}" 表内的样式  -->
    <el-table :data="list" border :header-cell-style="{background:'rgb(203,227,251)',color:'rgb(76,164,255)'}" height="660px">
      <el-table-column label="序号" align="center" width="50">
      <template slot-scope="scope">{{scope.$index+1}}</template>
      </el-table-column>

      <el-table-column prop="username" label="账号" align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center">
        <template slot-scope="scope">
          <el-popover placement="top" trigger="hover">
            <div class="look">
              <div>
                性别：
                <span v-if="scope.row.sex === '1'">男</span>
                <span v-else>女</span>
              </div>
              <div>身份证号：{{ scope.row.idcardno }}</div>

              <div>联系电话：{{ scope.row.tel}}</div>


            </div>
            <span slot="reference">{{scope.row.name}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="roles" label="角色" align="center" >
        <template slot-scope="scope">
          <div v-if="scope.row.roles !== null">
            <span v-for="(item, i) in scope.row.roles" :key="i">{{item.rolename}}<br></br></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="unitId" label="单位" align="center" minWidth="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.unitId === null" ></span>
          <span v-else >{{scope.row.units.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 1" type="success">正常</el-tag>
          <el-tag v-else-if=" scope.row.state === 0" type="info">锁定</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间"  align="center" minWidth="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updatetime" label="更新时间"  align="center" minWidth="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="memo" label="备注" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="320">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="beginUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="beginRemove(scope.row.id)">删除</el-button>
          <el-button v-if="scope.row.state === 1" size="mini" type="info" @click="beginLock(scope.row)">锁定</el-button>
          <el-button v-else-if="scope.row.state === 0" size="mini" type="success" @click="beginLock(scope.row)">解锁</el-button>
          <el-button size="mini" type="primary" @click="beginReset">重置密码</el-button>
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
      :title="`用户 - ${ editDialog.mode ? '新增' : '修改' }`"
      width="600px"
    >
      <!--用mode判断新增或修改，true表示新增，false表示修改-->
      <!--编辑对话框表单-->
      <el-form
        :model="editDialog.model"
        :rules="editDialog.rules"
        label-width="100px"
        ref="form"
      >
        <el-form-item label="单位名称：" prop="unitName">
          <el-select
            v-model="editDialog.model.unitName"
            placeholder="请选择"
            @change="selectUnitName"
          >
            <el-option
              v-for="item in unitList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称：" prop="roleName">
          <el-select
            v-model="editDialog.model.roleName"
            placeholder="请选择"
            @change="selectRoleName"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号：" prop="username">
          <el-input v-model="editDialog.model.username" placeholder="请输入账号"></el-input>
        </el-form-item>

        <el-form-item label="姓名：" prop="name">
          <el-input v-model="editDialog.model.name" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <template>
            <el-radio v-model="editDialog.model.sex" value="1" label="1">男</el-radio>
            <el-radio v-model="editDialog.model.sex" value="2" label="2">女</el-radio>
          </template>
        </el-form-item>
        <!--@input="sfzh"-->
        <el-form-item label="身份证号：" prop="idcardno">
          <el-input v-model="editDialog.model.idcardno" placeholder="请输入身份证号" ></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="tel">
          <el-input v-model="editDialog.model.tel" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="用户状态：" prop="state">
          <template>
            <el-radio v-model="editDialog.model.state" :value="1" label="1">正常</el-radio>
            <el-radio v-model="editDialog.model.state" :value="0" label="0">锁定</el-radio>
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
    <!--获取所有用户列表-->
  <!--  <el-dialog title="当前所有用户" :visible.sync="dialogTableVisible">
      <el-table :data="allUserList">
        <el-table-column property="id" label="ID"></el-table-column>
        <el-table-column property="username" label="用户名"></el-table-column>
        <el-table-column property="name" label="姓名"></el-table-column>
        <el-table-column property="tel" label="电话"></el-table-column>
      </el-table>
    </el-dialog>-->
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
  import { Message, MessageBox, Notification } from "element-ui";

  export default {
    name: "users",  // 用户管理
    data() {
      return {
          roleList: [],
          unitList: [],
        state: 1,
        // stateMode: true,
        users: [{ id: parseInt(localStorage.getItem("id")) }], // 用户id--重置密码
        roleIds: [], // 角色ID数组--新增、修改
        list: [],
       /* allUserList: [],

        dialogTableVisible: false,
*/


        searchForm: {
          username: ""
        },
        querySubmitForm: {
          username: ""
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
            username: "",
            name: "",
            password:"",
            sex: "1",
            idcardno: "",
            tel: "",
            state: "1",
            memo: "",
            unitName: '',
            unitId: '',
            roleName: ''
          },
          rules: {
            // 表单验证
            username: [
              {
                required: true,
                message: "账号不能为空",
                trigger: "blur"
              }
            ],
            unitName: [
              {
                required: true,
                message: "单位名称不能为空",
                trigger: "blur"
              }
            ],
            roleName: [
              {
                required: true,
                message: "角色名称不能为空",
                trigger: "blur"
              }
            ],
            name: [
              {
                required: true,
                message: "姓名不能为空",
                trigger: "blur"
              }
            ],
            idcardno: [
              {
                validator: (rule, value, callback) => {
                  if (value === "") callback();
                  else if (
                    !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(
                      value
                    )
                  )
                    callback(new Error("请输入正确的身份证号"));
                  else callback();
                },
                trigger: "blur",
                required: false,
              }
            ],
            tel: [
              {
                validator: (rule, value, callback) => {
                  if (value === "")  callback();
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
        // 获取角色列表
      getRoleList() {
        let that = this;
        request({
          url: "/sysRole",
          method: "get",

        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.roleList = response.data.data;

            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      //选择角色名称
      selectRoleName(val) {
            //console.log(val, '选中的id')
            let obj = {};
            obj = this.roleList.find(item => {
                return item.id === val;
            });
            this.editDialog.model.roleName = obj.rolename;
            this.roleIds.push(obj.id);
             // console.log(this.roleIds, '选择的name')
        },
        // 获取单位列表
      getUnitList() {
        let that = this;
        request({
          url: "/sysUnit",
          method: "get",

        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.unitList = response.data.data;

            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      //选择单位名称
        selectUnitName(val) {
            //console.log(val, '选中的id')
            let obj = {};
            obj = this.unitList.find(item => {
                return item.id === val;
            });
            this.editDialog.model.unitName = obj.name;
            this.editDialog.model.unitId = obj.id;
            // console.log(obj.name, '选择的name')
        },
      // 获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/sysUser/pages",
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
              that.pagination.total = response.data.data.length;
              // console.log(response.data.data);
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

      // 查询
      querySubmit() {
        this.querySubmitForm = Object.assign({}, this.searchForm);
        this.getData((this.pagination.pageNo = 1));
      },
      // 重置密码
      beginReset() {
        this.$confirm("确定要重置此用户的密码？", "提示", {
          showClose: false,
          type: "warning"
        })
          .then(() => {
            let data = this.users;
            let that = this;
             // console.log(data)
            request({
              url: "/sysUser/resertPassword",
              method: "post",
              data
            })
              .then(function(response) {
                if (response.data.code === 20000) {
                  let a = response.data.data;

                  that.$notify({
                    title: '提示',
                    message: `密码重置成功，请牢记！新密码为：${ a }`,
                    duration: 0
                  });


                 /* setTimeout(() => {
                    let that = this;
                    request({
                      url: "/auth/logout",
                      method: "get"
                    })
                      .then(function(response) {
                        if (response.data.code === 20000) {
//                          location = "/login"; // 跳转到登录页
//                          localStorage.clear(); // 清空localStorage

//                          return new Promise(() => {}); // 返回一个永远是pending的promise对象
                        }
                      })
                      .catch(function(error) {
                        console.log(error, "报错信息");
                      });
                  }, 1000);*/
                }
              })
              .catch(function(error) {
                console.log(error, "报错信息");
              });
          })
          .catch(() => {});

      },
      // 新增
      beginAdd() {
        this.editDialog.mode = true;
        this.editDialog.isShow = true;
      },
      // 修改
      beginUpdate(row) {
        this.editDialog.id = row.id;
        this.editDialog.model.username = row.username;
        this.editDialog.model.password = row.password;
        this.editDialog.model.name = row.name;
        this.editDialog.model.sex = row.sex;
        this.editDialog.model.idcardno = row.idcardno;
        this.editDialog.model.tel = row.tel;
        this.editDialog.model.state = row.state + "";
        this.editDialog.model.memo = row.memo;
        this.editDialog.model.unitId = row.unitId;

        this.editDialog.model.unitName = row.units.name;
        this.editDialog.model.roleName = row.roles[0].rolename;


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
                url: "/sysUser/user",
                method: "post",
                data: {
                  ...that.editDialog.model,
                  roleIds: that.roleIds,
                  date: Date.parse(new Date())
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
              // console.log(1);
              let that = this;
              request({
                url: "/sysUser/user",
                method: "put",
                data: {
                  id: that.editDialog.id,
                  ...that.editDialog.model,
                  roleIds: that.roleIds,
                  date: Date.parse(new Date())
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
              url: `/sysUser/${id}`,
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
      // 账户解锁与锁定
      beginLock(row) {
        let state;
        if (row.state === 0) {
          state = 1;
        } else if (row.state === 1) {
          state = 0;
        }
        this.$confirm(
          `确定要${row.state ? "锁定" : "解锁"}此账号？`,
          "提示",
          {
            showClose: false,
            type: "warning"
          }
        )
          .then(() => {
            let that = this;
            request({
              url: "/sysUser",
              method: "put",
              data: {
                id: row.id,
                state: state,
                date: Date.parse(new Date())
              }
            })
              .then(function(response) {
                if (response.data.code === 20000) {
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
      },



    },
    watch: {
      "editDialog.isShow"(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.$refs.form.resetFields();
          this.editDialog.id = 0;
          this.editDialog.model.username = "";
          this.editDialog.model.password = "";
          this.editDialog.model.name = "";
          this.editDialog.model.sex = "1";
          this.editDialog.model.idcardno = "";
          this.editDialog.model.tel = "";
          this.editDialog.model.state = "1";
          this.editDialog.model.memo = "";

          this.editDialog.model.unitName = '';
          this.editDialog.model.unitId = '';
          this.editDialog.model.roleName = '';
          this.roleIds = [];

        }
      },

    },
    created() {
      this.getData();
      this.getUnitList();
      this.getRoleList();

    }
  };
</script>

<style scoped>
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
    width: calc((96% - 285px) / 2);
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
  .page-wrapper >>> .el-input__inner{ border-radius: 8px }
  .page-wrapper >>> .el-pagination.is-background .btn-next, .page-wrapper >>> .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
    background-color: #fff;
  }
  .page-wrapper >>> .el-pagination.is-background .el-pager li{
    background-color: #fff;
  }
  .page-wrapper >>> .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #08C0B9;
    color: #FFF;
  }
  .page-wrapper >>>  .el-pagination.is-background .el-pager li.active {
    color: #fff;
    cursor: default;
  }
  .page-wrapper >>> .el-pagination.is-background .el-pager li:hover {
    color: #08C0B9;
  }
  .page-wrapper >>>.el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #08C0B9;
  }
  .page-wrapper >>> .el-pagination.is-background .el-pager li:not(.disabled).active:hover {
    background-color: #08C0B9;
    color: #FFF;
  }
</style>
