<template>
  <el-container class="page-wrapper">
    <el-header class="header">
      <div class="logo">
        <img src="../assets/tosunLOGO.png" alt height="60px"/>
        <h3 @click="gotokb">身份证设备运行监管平台</h3>
      </div>
      <div class="user-msg">
              <span class="white">
                <!--<img src="../../static/home/222.png" alt="">-->
                <i style="background: url('../../static/home/222.png') no-repeat center;width: 16px;height: 16px;display: inline-block;background-size: 100%"></i>
                {{date | formatDate}}
                </span>
        <span class="white">|</span>
        <span class="white">
                <i class="el-icon-user-solid"></i>
                您好，{{username}}</span>
        <span class="white">|</span>
        <!--@command="handleCommand"-->
        <el-badge is-dot class="item">
          <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link white cursor">
              <i class="el-icon-s-home" style="width: 16px;height: 16px;display: inline-block;"></i>
                个人中心<!-- <i class="el-icon-caret-bottom el-icon--right"></i> -->
              </span>
            <el-dropdown-menu slot="dropdown" class="marpad0">
              <el-dropdown-item command="logOut"><i class="el-icon-upload2"></i> 注销</el-dropdown-item>
              <el-dropdown-item command="beginUpdatePassword"><i class="el-icon-edit"></i>修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-badge>

        <!--<el-button class="btn-logout" size="mini" type="info" @click="logOut">退出登录</el-button>-->
        <!--<el-button class="btn-pwd" size="mini" type="primary" @click="beginUpdatePassword">修改密码</el-button>-->
      </div>
    </el-header>
    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogFormPassword"
      width="600px"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="passwordModel" label-width="100px" ref="form" :rules="rules">
        <el-form-item prop="oldpwd" label="原密码">
          <el-input v-model="passwordModel.oldpwd" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item prop="newPwd1" label="新密码">
          <el-input v-model="passwordModel.newPwd1" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item prop="newPwd2" label="确认密码">
          <el-input v-model="passwordModel.newPwd2" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormPassword = false">取 消</el-button>
        <el-button type="primary" @click="savePassword">确 定</el-button>
      </div>
    </el-dialog>
    <el-container>
      <el-aside width="200px" :class="aux.showMenu ? 'xshi' : 'yc' ">
        <el-menu
          unique-opened
          :default-active="activeTabName"
          text-color="#fff"
          background-color="#303133"
          active-text-color="#ffd04b"
          @select="changeTab"
        >
          <template v-for="(item, index) in menus">
            <el-submenu :index="index+''">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.label }}</span>
              </template>
              <el-menu-item
                v-for="(child, index) in item.children"
                :index="child.name"
                :key="index"
              >
                <i :class="child.icon"></i>
                <span>{{ child.label }}</span>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>

      <el-main v-model="activeTabName" v-for="tab in tabs" :key="tab" :name="tab">
        <component :is="tabsMap[tab].component"></component>
      </el-main>

      <!--<el-main  v-for="tab in tabs" :key="tab"  v-model="activeTabName" >-->
      <!--<component :is="tabsMap[tab].component" ></component>-->
      <!--</el-main>-->
    </el-container>
    <a :class="aux.btnCut ? 'ycann' : 'xshiann'" @click="wpAdv"></a>
  </el-container>
</template>


<script type="text/ecmascript-6">
  import Welcome from "./welcome"; // 主页

  // 系统模块
  import Users from "./Users"; // 用户管理
  import Role from "./Role"; // 角色管理
  import Routing from "./Routing"; // 路由管理
  import Unit from "./Unit"; // 单位管理
  import Audit from "./Audit"; // 日志审计
  import softwareInfo from "./softwareInfo"; // 软件信息管理
  import parameter from "./parameter"; // 参数管理

  // 设备模块
  import facilityInformation from "./facilityInformation"; // 设备信息管理
  import abnormalInformation from "./abnormalInformation"; // 异常信息管理
  import realtimeMode from "./realtimeMode"; // 设备实时状态监控

  // 监控模块
  import realData from "./realData"; // 实时数据看板

  // 业务模块
  import businessData from "./businessData"; // 业务数据查看

  // 统计模块
  import photoBusiness from "./photoBusiness"; // 拍照机业务统计
  import acceptBusiness from "./acceptBusiness"; // 受理机业务统计
  import evidenceBusiness from "./evidenceBusiness"; // 取证机业务统计
  import otherBusiness from "./otherBusiness"; // 其他业务待扩展
  import unitException from "./unitException"; // 设备故障率汇总
  import integration from "./integration"; // 拍照受理一体

  import request from "@/utils/request";
  import {Message, MessageBox} from "element-ui";
  // import { message } from "@/utils/message.js";
  import store from "../stroe";

  export default {
    name: "home",
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value !== this.passwordModel.newPwd1) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        aux: {
          showMenu: true, // 菜单显示
          btnCut: true // 按钮 class 名切换
        },
        activeTabName: "", // 当前显示的选项卡 激活的 name
        tabs: [""], // 当前显示的选项卡
        tabsMap: {
          // 所有的可能的会显示的选项卡
          welcome: {component: Welcome},
          Users: {component: Users},
          Role: {component: Role},
          Routing: {component: Routing},
          Unit: {component: Unit},
          Audit: {component: Audit},
          facilityInformation: {component: facilityInformation},
          abnormalInformation: {component: abnormalInformation},
          realtimeMode: {component: realtimeMode},
          realData: {component: realData},
          businessData: {component: businessData},
          photoBusiness: {component: photoBusiness},
          acceptBusiness: {component: acceptBusiness},
          evidenceBusiness: {component: evidenceBusiness},
          otherBusiness: {component: otherBusiness},
          unitException: {component: unitException},
          softwareInfo: {component: softwareInfo},
          integration: {component: integration},
          parameter: {component: parameter},
        },
        menus: JSON.parse(localStorage.getItem("menus")),
        dialogFormPassword: false,
        passwordModel: {
          oldpwd: "",
          newPwd1: "",
          newPwd2: ""
        },
        //验证规则
        rules: {
          oldpwd: [
            {
              required: true,
              message: "密码不能为空..",
              trigger: "blur"
            },
            {
              max: 20,
              min: 5,
              message: "密码长度5 - 20之间..",
              trigger: "blur"
            }
          ],

          newPwd1: [
            {
              required: true,
              message: "密码不能为空",
              trigger: "blur"
            },
            {
              min: 5,
              max: 20,
              message: "长度在 5 到 20 个字符",
              trigger: "blur"
            }
          ],
          newPwd2: [
            {
              required: true,
              message: "确认密码不能为空",
              trigger: "blur"
            },
            {
              min: 5,
              max: 20,
              message: "长度在 5 到 20 个字符",
              trigger: "blur"
            },
            {validator: validatePass2, trigger: "blur"}
          ]
        },
        username: localStorage.getItem("username"),
        date: new Date(),
        timer: null
      };
    },
    methods: {
      // select	菜单激活回调	index: 选中菜单项的 index
      changeTab(index) {
        // 将回调的 index 显示出来
        this.tabs.splice(0, 1, index);
        this.activeTabName = index;
        // 将当前组件名保存在localStorage，刷新留在当前组件
        localStorage.setItem("menuRouter", index);
      },
      //    addTab(index){
      //      // 将回调的 index 显示出来
      //      this.tabs.splice(0,1,index);
      //      this.activeTabName = index;
      //    },
      // 点击按钮 菜单显示隐藏   按钮切换 class 名
      wpAdv() {
        this.aux.btnCut = !this.aux.btnCut;
        this.aux.showMenu = !this.aux.showMenu;
      },
// 修改密码保存
      savePassword() {
        let that = this;
        that.$refs.form
          .validate()
          .then(flag => {
            // 前台输入验证成功
            if (flag) {
              return request({
                url: "/sysUser/updatePassword",
                method: "post",
                params: {
                  oldpwd: that.passwordModel.oldpwd,
                  newPwd: that.passwordModel.newPwd1,
                  newPwd: that.passwordModel.newPwd2
                }
              })
                .then(function (response) {
                  // console.log(25122121);
                  // console.log(response);
                  if (response.data.code === 20000) {
                    console.log(1111111111111);
                    that.dialogFormPassword = false;
                    MessageBox.alert(
                      "密码修改成功，请重新登录",
                      "提示",
                      {
                        confirmButtonText: "确定",
                        type: "warning"
                      }
                    ).then(() => {
                      localStorage.removeItem("id");
                      localStorage.removeItem("menus");
                      localStorage.removeItem("menuRouter");
                      localStorage.removeItem("rolesId");
                      localStorage.removeItem("units");
                      localStorage.removeItem("username");
                      that.$router.replace("/login"); // 跳转到登录页
                    });
                  }
                  return Promise.resolve(response);
                })
                .catch(function (error) {
                  console.log(error, "报错信息");
                });
            }
              // 验证失败
              else return new Promise(() => {
              });
          })
          .catch(() => {
            // this.$message.error('密码错误')
          }); // 消除失败的promise在浏览中报的警告
      },
      // 点击标题回到看板页
      gotokb() {
        let that = this;
        // this.activeTabName = 'realData';
        let yhm = localStorage.getItem("id");
        console.log(yhm);
        if (yhm === "1") {
          that.activeTabName = 'realData';
          that.tabs = ['realData']
          localStorage.setItem("menuRouter", "realData")
        } else {
          that.activeTabName = 'welcome';
          that.tabs = ['welcome']
          localStorage.setItem("menuRouter", "welcome")
        }

        //            localStorage.setItem("menuRouter", 'realData');
        // location.reload();
      },
      // 退出登录 和 修改密码
      handleCommand(command) {
        if (command === "logOut") {
          let that = this;
          this.$confirm("确定要退出登录吗？", "提示", {
            showClose: false,
            type: "warning"
          })
            .then(() => {
              request({
                url: "/auth/logout",
                method: "get"
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    // this.$cookies.remove('token');                        // 清除cookie中残留的过期的token
                    localStorage.removeItem("id");
                    localStorage.removeItem("menus");
                    localStorage.removeItem("menuRouter");
                    localStorage.removeItem("rolesId");
                    localStorage.removeItem("units");
                    localStorage.removeItem("username");
                    that.$router.replace("/login"); // 跳转到登录页
//                      localStorage.clear(); // 清空sessionStorage

                    return new Promise(() => {
                    }); // 返回一个永远是pending的promise对象
                  }
                })
                .catch(function (error) {
                  console.log(error, "报错信息");
                });
            })
            .catch(() => {
            })
        }
        if (command === "beginUpdatePassword") {
          this.dialogFormPassword = true;
        }
      },

    },
    watch: {
      dialogFormPassword(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.passwordModel.oldpwd = "";
          this.passwordModel.newPwd1 = "";
          this.passwordModel.newPwd2 = "";
        }
      }
    },
    filters: {
      formatDate(val) { //这里的value就是需要过滤的数据
        let Y = val.getFullYear();
        let M = val.getMonth() + 1;
        let D = val.getDate();
        let H = val.getHours();
        let MI = val.getMinutes();
        let S = val.getSeconds();
        return Y + "年" + M + "月" + D + "日" + H + "时" + MI + "分" + S + "秒"
      }
    },

    created() {

      let that = this; //声明一个变量指向Vue实例this，保证作用域一致
      that.activeTabName = localStorage.getItem("menuRouter");
      that.tabs[0] = localStorage.getItem("menuRouter");


      that.timer = setInterval(function () {
        that.date = new Date()//修改数据让他可以实时更新
      }, 1000);
      //   console.log((this.menus))

      // 从sessionStorage取出当前组件名，赋值给当前激活的项，刷新留在当前组件，登录进来首先打开login存入的firstpage
      // 判断是否需要重新登陆
      if (localStorage.getItem("id") === null) {
        this.$router.replace("/");
      }
    },
    beforeDestroy: function () {
      if (this.timer) {
        clearInterval(this.timer);

        // 从sessionStorage取出当前组件名，赋值给当前激活的项，刷新留在当前组件，登录进来首先打开login存入的firstpage
        this.activeTabName = localStorage.getItem("menuRouter");
        this.tabs[0] = localStorage.getItem("menuRouter");
      }


    }

  };
</script>

<style scoped>
  .el-container > .yc {
    display: none;
  }

  .page-wrapper {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  .header {
    height: 60px;
  }

  .el-header {
    background-color: #303133;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .el-main {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  .logo {
    padding: 0 10px;
  }

  .logo > img {
    height: 40px;
    margin: 10px 20px;
    float: left;
  }

  .logo > h3 {
    color: #ffffff;
    line-height: 60px;
    float: left;
    font-size: 22px;
    cursor: pointer;
  }

  .el-aside {
    height: 100%;
    background-color: #303133;
  }

  .el-menu-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .el-submenu {
    width: 200px;
  }

  .ycann {
    position: absolute;
    top: 50%;
    width: 17px;
    height: 61px;
    display: block;
    margin-left: 200px;
    background: url(../../static/Home/44.png) no-repeat 0 0;
    cursor: pointer;
  }

  .ycann:hover {
    background: url(../../static/Home/44.png) no-repeat 100% 0;
  }

  .xshiann {
    position: absolute;
    top: 50%;
    width: 17px;
    height: 61px;
    display: block;
    cursor: pointer;
    margin-left: 0px;
    background: url(../../static/Home/44.png) no-repeat 0 100%;
  }

  .xshiann:hover {
    background: url(../../static/Home/44.png) no-repeat 100% 100%;
  }

  .user-msg {
    display: flex;
    align-items: center;
    width: 550px;
    justify-content: space-around;
    margin-right: 50px;
  }

  .user-msg > * {
    float: left;
    color: white;

  }

  .white {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: white;
  }

  .cursor {
    cursor: pointer;
  }
</style>
