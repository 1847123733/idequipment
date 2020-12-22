<template>
    <div class="page-wrapper">
        <div class="box">
        <!--  <div class="fl">
            <img src="../../src/assets/denglu.jpg" >
          </div>
          <div class="fr"></div>-->
            <el-form class="login" :model="model" ref="form" :rules="rules" status-icon>
                <el-form-item prop="username">
                    <el-input type="text" placeholder="请输入账号" v-model="model.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="model.password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="btn-log" type="danger" @click="login">登录</el-button>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import request from "@/utils/request";
import axios from "axios";

export default {
    name: "login",
    data() {
        return {
            model: {
                username: "",
                password: ""
            },
            rules: {
                username: [
                    {
                        required: true,
                        message: "账号不能为空..",
                        trigger: "blur"
                    },
                    {
                        max: 20,
                        min: 3,
                        message: "账号长度3 - 20之间..",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "密码不能为空..",
                        trigger: "blur"
                    },
                    {
                        max: 20,
                        min: 5,
                        message: "账号长度5 - 20之间..",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        login() {
            //        console.log(JSON.stringify(this.model));
            this.$refs.form
                .validate()
                .then(flag => {
                    // 前台输入验证成功
                    if (flag) {
                        return request({
                            url: "/auth/login",
                            method: "post",
                            data: this.model
                            // headers: {
                            //     "Content-Type": "application/json"
                            // }
                        })
                          .then(function(response) {
                            if (response.data.code === 20000) {
                                localStorage.setItem(
                                    "id",
                                    response.data.data.id
                                );
                                let menus = response.data.data.menus;
                                // console.log(response.data.data.id);

                                localStorage.setItem(
                                    "menus",
                                    JSON.stringify(menus)
                                );
                                let username = response.data.data.username;
                              localStorage.setItem(
                                    "username",
                                  username
                                );

                                //                  let username = response.data.data.username;
                                //                  localStorage.setItem("username", JSON.stringify(username));
                                //                  console.log(username)
                                // 将登录进入打开的默认页面存入localStorage
                                if (response.data.data.roles[0].id === 1) {
                                    localStorage.setItem(
                                        "menuRouter",
                                        "realData"
                                    );
                                } else {
                                    localStorage.setItem(
                                        "menuRouter",
                                        "welcome"
                                    );
                                }

                                // 关于权限的
                                // 是否为超级管理员---1的时候为超管
                                localStorage.setItem( "rolesId", response.data.data.roles[0].id );
                                // 不是超管时的单位信息
                                let units = response.data.data.units;
                                localStorage.setItem(
                                    "units",
                                    JSON.stringify(units)
                                );
                            }
                        });
                    }
                    // 验证失败
                    else return new Promise(() => {});
                })
                .then(() => {
                   this.$router.replace("/home");
                })
                .catch(() => {}); // 消除失败的promise在浏览中报的警告
        }
    },
    created() {
        let that = this;
        document.onkeypress = function(e) {
            var keycode = document.all ? event.keyCode : e.which;
            if (keycode == 13) {
                that.login(); // 登录方法名
                return false;
            }
        };
        if(localStorage.getItem('id')) {
            this.$router.replace("/home");
        }
    }
};
</script>

<style scoped>
.page-wrapper {
    width: 100%;
    height: 100%;
    /*margin: 0 auto;*/
    background: url("../assets/beijing.png") no-repeat center center;
    background-size: 101% 101%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.box {
    width: 400px;
    /*height: 350px;*/
    text-align: center;
    /*background-color: #08C0B9;*/
    /*display:flex ;*/
    /*padding-bottom: 100px;*/
}
/*.fl{ width: 50%;flex-shrink: 0 }*/
/*.fl img{ width: 100%;height: 100% }*/
/*.fr{ width: 50%;flex-shrink: 0 }*/
.btn-log {
    width: 400px;
    border: none;
    outline: none;
}
</style>
