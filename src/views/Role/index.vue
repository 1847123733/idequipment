<template>
  <div class="page-wrapper">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item class="form-item-select" label="角色名称：">
        <el-input v-model="searchForm.rolename" clearable placeholder="请输入角色"></el-input>
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
      <!--<el-table-column prop="id" label="角色ID" align="center"></el-table-column>-->
      <!--<el-table-column prop="rolenum" label="角色编号" align="center"></el-table-column>-->
      <el-table-column prop="rolename" label="角色名称" align="center"></el-table-column>
      <!-- <el-table-column prop="superiorroleid" label="上级角色id"></el-table-column> -->
      <el-table-column prop="createtime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="updatetime" label="更新时间" align="center"></el-table-column>
      <el-table-column label="是否可用" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled === 1" type="success">可用</el-tag>
          <el-tag v-else type="info">不可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" align="center" ></el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="jurisdiction(scope.row.id)">授权</el-button>
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
      :title="`角色 - ${ editDialog.mode ? '新增' : '修改' }`"
      width="600px"
      top="5vh"
    >
      <!--用mode判断新增或修改，true表示新增，false表示修改-->
      <!--编辑对话框表单-->
      <el-form
        :model="editDialog.model"
        :rules="editDialog.rules"
        label-width="120px"
        ref="form"
      >
        <!--prop="rolenum"  角色编号验证-->
       <!-- <el-form-item label="角色编号：" >
          <el-input v-model="editDialog.model.rolenum" placeholder="请输入角色编号"></el-input>
        </el-form-item>-->
        <el-form-item label="角色名称：" prop="rolename">
          <el-input v-model="editDialog.model.rolename" placeholder="请输入角色名称"></el-input>
        </el-form-item>

        <!--<el-form-item label="上级角色id：" prop="superiorroleid">-->
          <!--<el-input v-model="editDialog.model.superiorroleid" placeholder="请输入上级角色id"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="是否可用：" prop="isEnabled">
          <template>
            <el-radio v-model="editDialog.model.isEnabled" :value="1" label="1">可用</el-radio>
            <el-radio v-model="editDialog.model.isEnabled" :value="0" label="0">不可用</el-radio>
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
    <!--查看权限的dialog-->
    <el-dialog
      title="权限管理"
      :visible="dialog"
      width="500px"
      :show-close="false"
      :close-on-click-model="false"
      :close-on-press-escape="false"
      top="5vh"
    >
<!--      default-expand-all  默认全部打开  -->
<!--      show-checkbox	节点是否可被选择-->
<!--      default-checked-keys	默认勾选的节点的 key 的数组  默认复选框就被选中不含一级标题-->
<!--     @check-change="handleCheckChange"  用户选择的复选框  所有选择的复选框  -->
<!--    @check-change="handleCheckChange" 好像没有什么用 -->
      <el-tree
        ref="roleTree"
        :data="meunList"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="checked"

        @check="aaa"
      ></el-tree>
      <div slot="footer">
        <el-button size="mini" type="primary" @click="confirmalter">确定</el-button>
        <el-button size="mini" @click="dialog = false">取消</el-button>
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
    name: "role",   // 角色
    data() {
      return {
        // 权限是否为新增   true 为新增
        //  为 false 时  为修改权限  id 保存当前要修改的角色
        qsEditlog: {
          isDataNull: false,
          id: null
        },

        //点击权限的dialog
        dialog: false,
        //所有权限的list
        meunList: [],
        //默认复选框就被选中不含一级标题
        checked: [],
        //用户选择的复选框   确实没有什么用
        // numberchecked: [],
        //真正发送请求的数据
        numbercheckeds: [],
        //保存的id  点击授权当前的 ID  无论是新增或者修改都要保存的 ID
        roleIded: null,
        //默认就有的权限
        ids: [],
        //做取消权限的
        aa: [],
        bb: [],
        list: [],
        searchForm: {
          rolename: ""
        },
        querySubmitForm: {
          rolename: ""
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
            rolenum: "",
            rolename: "",
            superiorroleid: "",
            isEnabled: "1",
            memo: ""
          },
          rules: {
            // 表单验证
            rolenum: [
              { required: true, message: "角色编号不能为空", trigger: "blur"}
            ],
            isEnabled: [
              { required: true, message: "不能为空", trigger: "blur"}
            ],
            rolename: [
              { required: true, message: "角色名称不能为空", trigger: "blur"}
            ],
            superiorroleid: [
              { required: true, message: "上级角色id不能为空", trigger: "blur"}
            ]
          }
        }
      };
    },
    methods: {
      // 获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/sysRole",
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
      //权限
      jurisdiction(id) {
        let that = this;
        that.roleIded = id;
        that.dialog = true;
         // console.log("1",that.numbercheckeds)
        //无条件查询所有权限
        request({
          url: "/sysMenu/list",
          method: "get",
          params: {
            date: Date.parse(new Date())
          }
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.meunList = response.data.data;
            }
          })
          .catch(function(error) {
            that.$message.error(
              "请求失败或登录失效，请检查网络或重新登录！"
            );
            console.log(error, "报错信息");
          });
        // 根据id查询角色权限
        request({
          url: "/sysRoleMenu/obj",
          method: "get",
          params: {
            roleId: id,
            date: Date.parse(new Date())
          }
        })
          .then(function(response) {
            // console.log(response);
            if (response.data.code === 20000) {
              //默认复选框就被选中，不含一级标题，先放空再push
              that.checked = [];
              //默认就有的权限，所有标题，先放空再push
              that.ids = [];

              if (JSON.stringify(response.data.data) == "{}") {
//                console.log("新增");
                that.qsEditlog.isDataNull = true;
              }
              else {
//                console.log("修改");
                // console.log(response.data.data.id)
                that.qsEditlog.id = response.data.data.id;
                that.qsEditlog.isDataNull = false;
                let arr = response.data.data.menus;
                // console.log(arr,6666666)
                //拿到所有标记的二级标题的标题
                for (let i = 0; i < arr.length; i++) {
                  for (let j = 0; j < arr[i].children.length; j++) {
                    that.checked.push(arr[i].children[j].id);

                  }
                }
                // console.log(that.checked,777777777);
                //拿到所有标题
                for (let i = 0; i < arr.length; i++) {
                  that.ids.push(arr[i].id);
                  for (let j = 0; j < arr[i].children.length; j++) {
                    that.ids.push(arr[i].children[j].id);
                  }
                }
                // console.log(that.ids,88888888)
                // 打开后先将当前所有选中的标题赋值给 numbercheckeds
                that.numbercheckeds = that.ids;
              }
            }
          })
          .catch(function(error) {
            // that.$message.error(
            //     "请求失败或登录失效，请检查网络或重新登录！"
            // );
            console.log(error, "报错信息");
          });
      },
      //确认添加权限
      confirmalter() {
        // let menuIds = this.$refs.roleTree.getCheckedKeys()
        // console.log(this.qsEditlog.isDataNull);
        // console.log(this.qsEditlog.id);
        // console.log("2",this.numbercheckeds);
        if (this.qsEditlog.isDataNull) {
          // 新增
          let that = this;
          request({
            url: "/sysRoleMenu",
            method: "post",
            data: {
              roleId: that.roleIded,
              //传递的是字符串
              // menuIds: menuIds.join(),
              menuIds: that.numbercheckeds.join(),
              date: Date.parse(new Date())
            }
          })
            .then(function(response) {
              if (response.data.code === 20000) {
                that.dialog = false;
                that.$message({
                  message: "修改成功",
                  type: "success"
                });
              }
            })
            .catch(function(error) {
              that.$message.error(
                "请求失败或登录失效，请检查网络或重新登录！"
              );
              console.log(error, "报错信息");
            });
        }
        else {
          // 修改
          let that = this;
          request({
            url: "/sysRoleMenu",
            method: "put",
            data: {
              id: that.qsEditlog.id,
              roleId: that.roleIded,
              //传递的是字符串
              // menuIds: menuIds.join(),
              menuIds: that.numbercheckeds.join(),
              date: Date.parse(new Date())
            }
          })
            .then(function(response) {
              if (response.data.code === 20000) {
                that.dialog = false;
                that.$message({
                  message: "修改成功",
                  type: "success"
                });
              }
            })
            .catch(function(error) {
              that.$message.error(
                "请求失败或登录失效，请检查网络或重新登录！"
              );
              console.log(error, "报错信息");
            });
        }
      },
      //好像没用  确实没有什么用
     /* handleCheckChange(data, checked, indeterminate) {
        //用户一选择就会输出用户选择数据的id
        // data 为 该节点所对应的对象 所有的对象
        // console.log(data,111111111111111)

        this.numberchecked.push(data.id);
        // console.log(this.numberchecked,2222222222)
        // this.numbercheckeds = this.numberchecked.concat(this.ids)
      },*/
      //做权限修改的
      aaa(a, b) {
        // console.log(b) // 一看输出就明白
        this.numbercheckeds = b.checkedKeys.concat(b.halfCheckedKeys);
        // console.log(this.numbercheckeds,22222)
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
        this.editDialog.model.rolenum = row.rolenum;
        this.editDialog.model.rolename = row.rolename;
        this.editDialog.model.superiorroleid = row.superiorroleid;
        this.editDialog.model.isEnabled = row.isEnabled + "";
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
                url: "/sysRole",
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
                url: "/sysRole",
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
              url: `/sysRole/${id}`,
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
          this.editDialog.model.rolenum = "";
          this.editDialog.model.rolename = "";
          this.editDialog.model.superiorroleid = "";
          this.editDialog.model.isEnabled = "1";
          this.editDialog.model.memo = "";
          this.qsEditlog.isDataNull = false
        }
      },
      dialog(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.checked = [];
          this.roleIded = null;
          this.numberchecked = [];
          this.numbercheckeds = [];
          this.qsEditlog.id = null;
        }
      }
    },
    created() {
      this.getData();
    }
  };
</script>

<style scoped>
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
  .form-item-btn {
    width: calc((96% - 285px) / 2);
  }
  .demo-form-inline > * {
    margin: 0;
    margin-right: 50px;
  }
  .btn{
    width: 80px;
  }
  .form-item-btn.one {
    text-align: left;
  }
  .form-item-btn.two {
    text-align: right;
  }
</style>
