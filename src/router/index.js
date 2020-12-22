import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import Views from "../views";

Vue.use(Router);

let router = new Router({
  routes: [
    { path: "/", redirect: "/login" },
    {
      path: "/login",
      meta: { title: "身份证设备运行监管平台-登陆" },
      component: Views.login
    },
    {
      path: "/home",
      meta: { title: "身份证设备运行监管平台-首页", requireAuth: true },
      component: Views.home
     
    }
  ]
});
router.beforeEach((to, from, next) => {
  // let isLogin = localStorage.id;
  if (to.meta.requireAuth) {
    //判断是否需要登录验证
    if (localStorage.id) {
      // 判断是否登录
      next();
    } else {
      next("/"); //不为true跳转到登录页面
    }
  } else {
    next(); //不为true往下执行
  }
});

export default router;
