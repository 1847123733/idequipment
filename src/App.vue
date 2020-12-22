<template>
    <div id="app">
        <router-view v-wechat-title="$route.meta.title" />
    </div>
</template>

<script>
export default {

    name: "App",

    data() {
        return {
            _beforeUnload_time: "",
            _gap_time: ""
        };
    },
    methods: {
        beforeunloadHandler() {
            this._beforeUnload_time = new Date().getTime();
        },
        unloadHandler(e) {
            this._gap_time = new Date().getTime() - this._beforeUnload_time;
            console.log(this._gap_time);

            //判断是窗口关闭还是刷新  要发送同步请求
            if (this._gap_time <= 5) {
                //关闭
                localStorage.removeItem("id");
                localStorage.removeItem("menus");
                localStorage.removeItem("menuRouter");
                localStorage.removeItem("rolesId");
                localStorage.removeItem("units");
                localStorage.removeItem("username");
                // debugger
                localStorage.clear();
            }
        }
    },
    destroyed() {
        window.removeEventListener("beforeunload", e =>
            this.beforeunloadHandler(e)
        );
        window.removeEventListener("unload", e => this.unloadHandler(e));
    },
    mounted() {
        //监听页面是否关闭
        window.addEventListener("beforeunload", e =>
            this.beforeunloadHandler(e)
        );
        window.addEventListener("unload", e => this.unloadHandler(e));
    }
};
</script>

<style>
#app {
    width: 100%;
    height: 100%;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    color: #2c3e50;
    /*margin-top: 60px;*/
}
</style>
