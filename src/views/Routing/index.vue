<template>
  <div class="page-wrapper">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item class="form-item-select" label="路由标题： ">
        <el-select clearable v-model="searchForm.label" placeholder="请选择路由标题" >
          <el-option  v-for="(item, i) in menuList" :key="i" :label="item.label" :value="item.label"  >
            <i :class="item.icon"></i>
            <span>{{item.label}}</span>
          </el-option>
        </el-select>
        <!-- <el-input v-model="searchForm.label"></el-input> -->
      </el-form-item>
      <el-form-item class="form-item-btn one">
        <el-button class="btn" type="primary" @click="querySubmit" size="medium">查询</el-button>
      </el-form-item>
      <el-form-item class="form-item-btn two">
        <el-button class="btn" type="primary" @click="beginAdd" size="medium">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 内容表格 -->
    <el-table :data="list" border :header-cell-style="{background:'rgba(203,227,251,0.6)',color:'rgb(76,164,255)'}" height="660px" >
      <el-table-column label="序号" align="center">
        <template slot-scope="scope">{{scope.$index+1}}</template>
      </el-table-column>
      <el-table-column prop="name" label="路由名称" min-width="100" align="center"></el-table-column>
      <el-table-column prop="path" label="路由路径" min-width="100" align="center"></el-table-column>
      <el-table-column prop="component" label="组件路径" min-width="120" align="center"></el-table-column>
      <el-table-column prop="icon" label="图标" min-width="100" align="center">
        <template slot-scope="scope">
          <i class="iconClass" :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="label" label="路由显示标题" min-width="120" align="center"></el-table-column>
      <el-table-column prop="pid" label="上级菜单" align="center" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.pid === 0">无</span>
          <span v-else-if="scope.row.pid === 1" class="el-icon-setting">系统模块</span>
          <span v-else-if="scope.row.pid === 31" class="el-icon-monitor">设备模块</span>
          <span v-else-if="scope.row.pid === 33" class="el-icon-video-camera">监控模块</span>
          <span v-else-if="scope.row.pid === 38" class="el-icon-s-data">业务模块</span>
          <span v-else class="el-icon-folder-opened">统计模块</span>
        </template>
      </el-table-column>
      <el-table-column prop="menulevel" label="菜单级别" min-width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.menulevel === 1">一级菜单</el-tag>
          <el-tag v-else-if="scope.row.menulevel === 2"  type="warning">二级菜单</el-tag>
          <el-tag  type="info" v-else>{{scope.row.menulevel.label}}</el-tag>

        </template>
      </el-table-column>
      <el-table-column label="是否可用" align="center" min-width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled === 1" type="success">可用</el-tag>
          <el-tag v-else type="info">不可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updatetime" label="更新时间" min-width="160" align="center"></el-table-column>
      <el-table-column prop="createtime" label="创建时间" min-width="160" align="center"></el-table-column>
      <el-table-column prop="memo" label="备注" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="160" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="success" @click="jurisdiction(scope.row.id)">权限</!-->
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
      :title="`路由 - ${ editDialog.mode ? '新增' : '修改' }`"
      width="600px"
    >
      <!--用mode判断新增或修改，true表示新增，false表示修改-->
      <!--编辑对话框表单-->
      <el-form
        :model="editDialog.model"
        :rules="editDialog.rules"
        label-width="120px"
        ref="form"
      >
        <el-form-item label="路由名称：" prop="name">
          <el-input v-model="editDialog.model.name" placeholder="请输入路由名称"></el-input>
        </el-form-item>
        <el-form-item label="路由路径：" prop="path">
          <el-input v-model="editDialog.model.path" placeholder="请输入路由路径"></el-input>
        </el-form-item>
        <el-form-item label="组件路径：" prop="component">
          <el-input v-model="editDialog.model.component" placeholder="请输入组件路径"></el-input>
        </el-form-item>
        <el-form-item label="图标：" prop="icon">
          <el-input v-model="editDialog.model.icon" placeholder="请输入图标"></el-input>
        </el-form-item>
        <el-form-item label="路由显示标题：" prop="label">
          <el-input v-model="editDialog.model.label" placeholder="请输入路由显示标题"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单id：" prop="pid">
          <el-select v-model="editDialog.model.pid" placeholder="请选择上级菜单">
            <el-option label="0" value="0"></el-option>
            <el-option
              v-for="item in menus"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="editDialog.model.pid" placeholder="请输入上级菜单id"></el-input> -->
        </el-form-item>
        <el-form-item label="菜单级别：" prop="menulevel">
          <el-select clearable v-model="editDialog.model.menulevel">
            <el-option key="1" value="1" label="一级"></el-option>
            <el-option key="2" value="2" label="二级"></el-option>
          </el-select>
          <!-- <el-input v-model="editDialog.model.menulevel" placeholder="请输入菜单级别"></el-input> -->
        </el-form-item>
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
    name: "menus",  // 路由
    data() {
      return {
        list: [],
        searchForm: {
          label: ""
        },
        querySubmitForm: {
          label: ""
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
            path: "",
            component: "",
            icon: "",
            label: "",
            pid: "",
            menulevel: "",
            isEnabled: "1",
            memo: ""
          },
          rules: {
            // 表单验证
            name: [
              {
                required: true,
                message: "路由名称不能为空",
                trigger: "blur"
              }
            ],
            path: [
              {
                required: true,
                message: "路由路径不能为空",
                trigger: "blur"
              }
            ],
            component: [
              {
                required: true,
                message: "组件路径不能为空",
                trigger: "blur"
              }
            ],
            icon: [
              {
                required: true,
                message: "图标不能为空",
                trigger: "blur"
              }
            ],
            label: [
              {
                required: true,
                message: "路由显示标题不能为空",
                trigger: "blur"
              }
            ],
            pid: [
              {
                required: true,
                message: "上级菜单id不能为空",
                trigger: "blur"
              }
            ],
            menulevel: [
              {
                required: true,
                message: "菜单级别不能为空",
                trigger: "blur"
              }
            ]
          }
        },
        menus: [], // 登录要展示的一级菜单数组
        menuList: []
      };
    },
    methods: {
      // 获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/sysMenu",
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
              // console.log(111111);
              // console.log(response);
              that.list = response.data.data;
              that.pagination.total = response.data.recordsTotal;
            }
          })
          .catch(function(error) {
            console.log(222222);
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
        console.log(row)
        this.editDialog.id = row.id;
        this.editDialog.model.name = row.name;
        this.editDialog.model.path = row.path;
        this.editDialog.model.component = row.component;
        this.editDialog.model.icon = row.icon;
        this.editDialog.model.label = row.label;
        this.editDialog.model.pid = row.pid;
        this.editDialog.model.menulevel = row.menulevel;
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
                url: "/sysMenu",
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
                url: "/sysMenu",
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
              url: `/sysMenu/${id}`,
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
          this.editDialog.model.name = "";
          this.editDialog.model.path = "";
          this.editDialog.model.component = "";
          this.editDialog.model.icon = "";
          this.editDialog.model.label = "";
          this.editDialog.model.pid = "";
          this.editDialog.model.menulevel = "";
          this.editDialog.model.isEnabled = "1";
          this.editDialog.model.memo = "";
        }
      }
    },
    created() {
      this.getData();
      // 从localStorage取出当前账号登录后要展示的一级菜单数组
      this.menus = JSON.parse(localStorage.getItem("menus"));
      var aaa = {};
      for (var i = 0; i < this.menus.length; i++) {
        aaa.label = this.menus[i].label;
        aaa.icon = this.menus[i].icon;
        // console.log(aaa)
        // console.log(this.menus[i].label)
         this.menuList.push(aaa);
        // this.menuList.push(this.menus[i].label);
        aaa = {}
        // console.log(this.menuList)
        for (var j = 0; j < this.menus[i].children.length; j++) {
          aaa.label = this.menus[i].children[j].label;
          aaa.icon = this.menus[i].children[j].icon;
          // console.log(this.menus[i].children[j].label)
          // this.menuList.push(this.menus[i].children[j].label);
          this.menuList.push(aaa);
          aaa = {}
          // console.log(aaa)
          // console.log(this.menuList)
        }
      }
      // console.log(this.menuList)
    }
  };
</script>

<style scoped>
  .page-wrapper > .el-form {
    height: 60px;
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
  .form-item-btn {
    width: calc((96% - 285px) / 2);
    /* width: 96%; */
  }
  .form-item-btn.one {
    text-align: left;
  }
  .form-item-btn.two {
    text-align: right;
  }
  .iconClass {
    font-size: 24px;
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


  .demo-form-inline {
    white-space: nowrap;
    width: 100%;
    /*background-color: #;*/
    /*box-shadow: 1px 1px 5px #0000001c;*/
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

/*  .el-table--border td, .el-table--border th {
    border-right: 1px solid #a9d2ff !important;
  }
  .el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid #a9d2ff !important;
  }*/
</style>
