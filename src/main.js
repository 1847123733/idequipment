// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';


import store from './stroe';


// elemnet
import ElementUI  from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './assets/reset.css'
// 封装的 message
import { message } from '@/utils/resetMessage';
Vue.use(ElementUI);
Vue.prototype.$onces = message;
// cookies
import Cookies from 'js-cookie';
Vue.prototype.$cookie = Cookies;

// 标题
import VueWechatTitle from 'vue-wechat-title';
Vue.use(VueWechatTitle);


Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
