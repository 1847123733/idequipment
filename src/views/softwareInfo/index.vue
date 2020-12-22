<template>
  <div class="page-wrapper">
    <el-form :inline="true" class="demo-form-inline">



      <el-form-item class="form-item-select" label="版本号： ">
        <el-input v-model="searchForm.version" placeholder="请输入查询版本号" clearable></el-input>
      </el-form-item>


      <el-form-item class="form-item-btn one">
        <el-button class="btn" type="primary" @click="querySubmit" size="medium">查询</el-button>
      </el-form-item>
      <el-form-item class="form-item-btn two">
        <el-button class="btn btn-add" type="primary" @click="beginAdd" size="medium">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 内容表格 -->
    <el-table :data="list" border :header-cell-style="{background:'rgba(203,227,251,0.6)',color:'rgb(76,164,255)'}" height="660px">
      <el-table-column label="序号" align="center" width="50">
        <template slot-scope="scope">{{scope.$index+1}}</template>
      </el-table-column>
      <!--<el-table-column prop="id" label="id" align="center" minWidth="90" ></el-table-column>-->
      <el-table-column prop="version" label="版本号" align="center"  show-overflow-tooltip></el-table-column>
      <el-table-column prop="name" label="版本简称" align="center"  show-overflow-tooltip></el-table-column>
      <el-table-column prop="content" label="更新内容" align="center"  show-overflow-tooltip></el-table-column>
      <el-table-column prop="path" label="保存路径" align="center"  show-overflow-tooltip></el-table-column>
      <el-table-column prop="uploader" label="上传人" align="center"></el-table-column>
      <el-table-column prop="createtime" label="创建时间" align="center" minWidth="155"></el-table-column>
      <el-table-column prop="updatetime" label="修改时间" align="center" minWidth="155"></el-table-column>
      <el-table-column prop="memo" label="备注" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="320">
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
      :title="`软件信息管理 - ${ editDialog.mode ? '新增' : '修改' }`"
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
        <!--                <el-form-item v-show="!editDialog.mode" label="ID：" prop="id">-->
        <!--                    <el-input v-model="editDialog.id" disabled placeholder="请输入用户ID"></el-input>-->
        <!--                </el-form-item>-->
        <el-form-item label="版本号：" prop="version">
          <el-input v-model="editDialog.model.version" placeholder="请输入版本号"></el-input>
        </el-form-item>
        <el-form-item label="版本简称：" prop="name">
          <el-input v-model="editDialog.model.name" placeholder="请输入版本简称"></el-input>
        </el-form-item>
        <el-form-item label="更新内容：" prop="content">
          <el-input v-model="editDialog.model.content" placeholder="请输入更新内容"></el-input>
        </el-form-item>
        <el-form-item label="保存路径：" prop="path">
          <el-input v-model="editDialog.model.path" placeholder="请输入保存路径"></el-input>
        </el-form-item>
        <el-form-item label="上传人：" prop="uploader">
          <el-input v-model="editDialog.model.uploader" placeholder="请输入上传人"></el-input>
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
    name: "softwareInfo",   // 软件信息管理
    data() {
      return {
        list: [],
        searchForm: {
          version:"",

        },
        querySubmitForm: {
          version:"",
        },
        // 分页控件
        editDialog: {
          isShow: false,
          mode: true,
          id: 0,
          model: {
            id:null,
            version: "",
            name: "",
            content:"",
            path: "",
            uploader: "",
            createtime: "",
            updatetime: "",
            memo: ""
          },
          rules: {
            // 表单验证
            version: [
              {
                required: true,
                message: "版本号不能为空",
                trigger: "blur"
              }
            ],
            name: [
              {
                required: true,
                message: "版本简称不能为空",
                trigger: "blur"
              }
            ],
            content: [
              {
                required: true,
                message: "更新内容不能为空",
                trigger: "blur"
              }
            ],
            path: [
              {
                required: true,
                message: "保存路径不能为空",
                trigger: "blur"
              }
            ],
            uploader: [
              {
                required: true,
                message: "上传人不能为空",
                trigger: "blur"
              }
            ],
            memo: [
              {
                required: true,
                message: "备注不能为空",
                trigger: "blur"
              }
            ],

          }
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
          url: "/sysSoftware",
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
      // 新增
      beginAdd() {
        this.editDialog.mode = true;
        this.editDialog.isShow = true;
      },
      // 修改
      beginUpdate(row) {
        console.log(row);
        this.editDialog.model.id = row.id;
        this.editDialog.model.version = row.version;
        this.editDialog.model.name = row.name;
        this.editDialog.model.content = row.content;
        this.editDialog.model.path = row.path;
        this.editDialog.model.uploader = row.uploader;
        this.editDialog.model.createtime = row.createtime;
        this.editDialog.model.updatetime = row.updatetime;
        this.editDialog.model.memo = row.memo;


        this.editDialog.mode = false;
        this.editDialog.isShow = true;
      },
      // 删除
      beginRemove(id) {
        console.log(id);
        // let data = { id, date: Date.parse(new Date()) };
        this.$confirm("确定要删除此条记录？", "提示", {
          showClose: false,
          type: "warning"
        })
          .then(() => {
            let that = this;
            request({
              url: `/sysSoftware/${id}`,
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
      // 保存
      save() {
        this.$refs.form
          .validate()
          .then(() => {
            if (this.editDialog.mode) {
              // 新增
              let that = this;
              request({
                url: "/sysSoftware",
                method: "post",
                data: {
                  ...that.editDialog.model,
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
                url: "/sysSoftware",
                method: "put",
                data: {
                  id: that.editDialog.id,
                  ...that.editDialog.model,

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
    },
    watch: {
      "editDialog.isShow"(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.$refs.form.resetFields();

          this.editDialog.id = null;
          this.editDialog.model.version = "";
          this.editDialog.model.name = "";
          this.editDialog.model.content = "";
          this.editDialog.model.path = "";
          this.editDialog.model.uploader = "";
          this.editDialog.model.createtime = "";
          this.editDialog.model.updatetime = "";
          this.editDialog.model.memo =  "";
        }
      },

    },
    created() {
      this.getData();
    }
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
    margin-right: 50px;
  }
  .btn-add {
    margin-right: 70px;
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
