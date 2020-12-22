// 1.使用vuex创建数据仓库，并导出
import Vue from 'vue';
// 2、引入 vuex
import Vuex from 'vuex';
import session from './session.js';
// 3、调用 Vuex
Vue.use(Vuex);
// 4.创建仓库的实例对象
let store = new Vuex.Store({
        // 配置整合所有子仓库，当前有几个子仓库    session
        modules: { session },
        // 主要存放要放在vuex创库在的数据
        state: {  },
        // 计算属性
        getters: {  },
        // 方法，只有mutations中的方法才有资格修改state中的数据
        // 只能包含同步代码，不能包含耗时的异步代码
        mutations: {  },
        // 方法，无法修改state中的值，可以包含耗时的异步操作
        actions: {  }
});
// 导出
export default store;
