import axios from "axios";
import router from "../router";
import { Message, MessageBox } from "element-ui";
import store from '../stroe'
// import QS from 'qs'
import { removeToken } from "@/utils/auth";
import { showLoading, hideLoading } from "./loading.js";


// 跨域携带session
axios.defaults.withCredentials = true;

const service = axios.create({
  baseURL:apis.BASE_API, // api的base_url
  timeout: 115000 // request timeout
});

// http request 请求拦截器，对请求数据处理，有token值则配置上token值
// service.interceptors.request.use(
//   config => {
//     if (config.method === 'post') {
//       config.data = QS.stringify(config.data) // 转换为Form Data，防止post请求参数无法传到后台
//     }
//     return config
//   }, error => {
//     console.log(error)
//     return Promise.reject(error)
//   })

// http response 服务器响应拦截器，这里拦截错误及登陆失效
service.interceptors.response.use(
  response => {
    // showLoading();        // 请求之前打开loading
    const res = response.data;
    // console.log(response);
    if (res.code !== 20000) {
      if (res.code === 50004) {
        removeToken();
        // MessageBox.alert("你的登录状态已失效，请重新登录", "提示", {
        //   confirmButtonText: "确定",
        //   callback: action => {
        //     // store.dispatch('LogOut').then(() => {
        //     //     // router.replace("/login");
        //     //     // location.replace('/login')
        //     //     location.reload()
        //     //   })

        //   }
        // });
        MessageBox.alert('你的登录状态已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          store.dispatch('LogOut').then(() => {
            // location.reload();
            localStorage.clear(); // 清空localStorage
          })
        })

        return Promise.resolve(response);
      }
      if (res.code === 50003) {
        // removeToken();
        MessageBox.alert(res.message, '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          store.dispatch('LogOut').then(() => {
            // location.reload();
            localStorage.clear(); // 清空localStorage
          })
        })

        return Promise.resolve(response);
      }
      if (res.code === 50005 || res.code === 55000 || res.code === 40001 || res.code === 50055) {
        if (res.message) {
          Message({
            message: res.message,
            type: "error",
            duration: 5 * 1000
          });
        }
        // setTimeout(() => hideLoading(), 500);  // 延时500毫秒关闭loading
        return Promise.reject(res.message);
      }
    } else {
      // setTimeout(() => hideLoading(), 500);  // 延时500毫秒关闭loading

      return Promise.resolve(response);
    }
  },
  error => {
    // console.log('err' + error)// for debug
    return Promise.reject(error);
  }
);

export default service;
