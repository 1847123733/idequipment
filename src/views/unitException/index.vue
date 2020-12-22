<template>
    <div class="page-wrapper">
        <div class="top">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item v-show="areaCategory === 'F'" class="form-item-select" label="设备所在地">
                    <el-row>
                        <el-select
                            style="width: 142px"
                            v-model="provinceValue"
                            placeholder="请选择"
                            @change="selectProvimce"
                        >
                            <el-option
                                v-for="(item,index) of provincearr"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                        <el-select
                            style="width: 142px"
                            v-model="cityValue"
                            placeholder="请选择"
                            @change="selectcity"
                        >
                            <el-option
                                v-for="(item,index) of cityarr"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                        <el-select
                            style="width: 142px"
                            placeholder="请选择"
                            v-model="RegionValue"
                            @change="selectRegion"
                        >
                            <el-option
                                v-for="(item,index) of regionarr"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-row>
                </el-form-item>
                <el-form-item
                    v-show="areaCategory === 'M' && areaPower === 2"
                    class="form-item-select"
                    label="设备所在地"
                >
                    <el-row>
                        <el-select
                            style="width: 142px"
                            v-model="provinceValue"
                            placeholder="请选择"
                            @change="selectProvimce"
                        >
                            <el-option
                                v-for="(item,index) of provincearr"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                                v-show="item.id === areaCodeProvince"
                            ></el-option>
                        </el-select>
                        <el-select
                            style="width: 142px"
                            v-model="cityValue"
                            placeholder="请选择"
                            @change="selectcity"
                        >
                            <el-option
                                v-for="(item,index) of cityarr"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                        <el-select
                            style="width: 142px"
                            placeholder="请选择"
                            v-model="RegionValue"
                            @change="selectRegion"
                        >
                            <el-option
                                v-for="(item,index) of regionarr"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-row>
                </el-form-item>
                <el-form-item
                    v-show="areaCategory === 'M' && areaPower === 3"
                    class="form-item-select"
                    label="设备所在地"
                >
                    <el-row>
                        <el-select
                            style="width: 142px"
                            v-model="provinceValue"
                            placeholder="请选择"
                            @change="selectProvimce"
                        >
                            <el-option
                                v-for="(item,index) of provincearr"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                                v-show="item.id === areaCodeProvince"
                            ></el-option>
                        </el-select>
                        <el-select
                            style="width: 142px"
                            v-model="cityValue"
                            placeholder="请选择"
                            @change="selectcity"
                        >
                            <el-option
                                v-for="(item,index) of cityarr"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                                v-show="item.id === areaCodeCity"
                            ></el-option>
                        </el-select>
                        <el-select
                            style="width: 142px"
                            placeholder="请选择"
                            v-model="RegionValue"
                            @change="selectRegion"
                        >
                            <el-option
                                v-for="(item,index) of regionarr"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-row>
                </el-form-item>

                <el-form-item class="form-item-btn one">
                    <el-button class="btn-query" type="primary" @click="querySubmit">搜索</el-button>
                    <input style="margin-left: 20px;color: #FF0000" value="显示本月设备故障率汇总" readonly />
                    <!-- <el-button class="btn-query" @click="exportExcel" type="success">导出</el-button> -->
                </el-form-item>
            </el-form>
        </div>

        <div class="bot">
            <div class="biaoge">
                <div class="tab-top">
                    <!-- <h3 class="hegel">拍照合格率 (四舍五入保留小数点后两位)</h3> -->
                    <!--@click="exportExcel"-->
                    <el-button class="btn-query" type="success" @click="exportExcel">导出</el-button>
                </div>
                <el-table id="exportTab" :data="list" border :header-cell-style="{background:'rgba(203,227,251,0.6)',color:'rgb(76,164,255)'}">
                  <el-table-column prop="sname" label="厂商" align="center"></el-table-column>
                  <el-table-column prop="errcount" label="故障次数" align="center"></el-table-column>
                    <el-table-column prop="total" label="总次数" align="center"></el-table-column>
                    <!--<el-table-column prop="rolenum" label="角色编号" align="center"></el-table-column>-->
                    <el-table-column prop="rat" label="故障率" align="center"></el-table-column>
                    <!-- <el-table-column prop="superiorroleid" label="上级角色id"></el-table-column> -->


                </el-table>
            </div>
            <div class="zhuz">
                <div id="zhuxing"></div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import FileSaver from "file-saver";
import XLSX from "xlsx";
import echarts from "echarts";
import VDistpicker from "v-distpicker";
import request from "@/utils/request";
import axios from "axios";
var myCharts;
import { province, map } from "@/assets/area";
export default {
    name: "unitexception",
    components: { VDistpicker },
    data() {
        return {
            //省市区start
            arr: [1, 3, 4],
            province: [],
            map: [],
            cityarr: [],
            regionarr: [],
            provinceValue: "",
            cityValue: "",
            RegionValue: "",
            //省市区end
            rolesId: "", //角色id，判断是否为超管
            units: {}, // 角色对象信息
            areaCodeProvince: "", // 本省
            areaCodeCity: "", // 本市
            areaCategory: "", // 是否为管理单位
            areaPower: "", // 省市区
            xAxis: [],
            series: [],
            list: [],
            searchForm: {
                areaCode: "",
                startTime: "",
                endTime: ""
            },
            querySubmitForm: {
                areaCode: "",
                startTime: "",
                endTime: ""
            },

            // pagination: {
            //     total: 0, //总条数
            //     pageNo: 1, // 页数
            //     length: 2 // 每页的条数
            // }, // 分页控件
            place: ""
        };
    },
    methods: {
        //选择省
        selectProvimce(id) {
            this.cityarr = [];
            this.regionarr = [];
            this.cityValue = "";
            this.RegionValue = "";
            for (let item of this.provincearr) {
                if (id == item.id) {
                    this.cityarr = item.children;
                }
            }
            this.searchForm.areaCode = this.provinceValue.slice(0, 2);
        },
        //选择市
        selectcity(id) {
            this.regionarr = [];
            this.RegionValue = "";
            for (let item of this.cityarr) {
                if (id == item.id) {
                    this.regionarr = item.children;
                }
            }
            this.searchForm.areaCode = this.cityValue.slice(0, 4);
        },
        //选择区
        selectRegion(id) {
            this.searchForm.areaCode = this.RegionValue;
        },
        // 导出excel表格
        exportExcel() {
            /* generate workbook object from table */
            var xlsxParam = { raw: true }; // 导出的内容只做解析，不进行格式转换
            var wb = XLSX.utils.table_to_book(
                document.querySelector("#exportTab"),
                xlsxParam
            );

            /* get binary string as output */
            var wbout = XLSX.write(wb, {
                bookType: "xlsx",
                bookSST: true,
                type: "array"
            });
            try {
                FileSaver.saveAs(
                    new Blob([wbout], { type: "application/octet-stream" }),
                    "取证表.xlsx"
                );
            } catch (e) {
                if (typeof console !== "undefined") {
                    console.log(e, wbout);
                }
            }
            return wbout;
        },
        // 导出excel表格
        // exportExcel() {
        // 封装的request导出会有问题
        // axios({
        //     method: "get",
        //     url: "http://192.168.8.10:7077/idRuin/export/area",
        //     data: {
        //         ...this.querySubmitForm,
        //         date: Date.parse(new Date())
        //     },
        //     responseType: "blob"
        // })
        //     .then(res => {
        //         console.log(res);
        //         const link = document.createElement("a");
        //         let blob = new Blob([res.data], {
        //             type: "application/vnd.ms-excel"
        //         });
        //         link.style.display = "none";
        //         link.href = URL.createObjectURL(blob);
        //         link.setAttribute("download", "地区统计" + ".xlsx");
        //         document.body.appendChild(link);
        //         link.click();
        //         document.body.removeChild(link);
        //     })
        //     .catch(error => {
        //         this.$Notice.error({
        //             title: "错误",
        //             desc: "网络连接错误"
        //         });
        //         console.log(error);
        //     });
        // },  ...that.querySubmitForm
        // 获取数据
        getList() {
            // 初始化图表--异步执行--需要加外层promise
            return new Promise((resolve, reject) => {
                let that = this;
                request({
                    url: "/chart/devicerr",
                    method: "get",
                    params: {
                        areaCode: that.searchForm.areaCode
                    }
                })
                    .then(function(response) {
                        resolve(response);

                        if (response.data.code === 20000) {
                            that.list = response.data.list;
                            //                            console.log(that.list);
                            that.xAxis = response.data.xAxis;
                            that.series = response.data.series;

                            //                          myCharts.setOption(getOption(that.xAxis, that.series));
                            //                          chart.setOption(getOption(xAxisData, data));
                        }
                    })
                    .catch(function(error) {
                        console.log(error, "报错信息");
                        // reject(error);
                    });
            });
        },

        // 查询
        async querySubmit() {
            //            console.log(1);
            this.querySubmitForm = Object.assign({}, this.searchForm);
            //            console.log(2);
            await this.getList();
            //            this.refreshCharts();
            this.drawZhuxing();
        },

        // // 换每页条数
        // sizeChangeHandler(length) {
        //     this.pagination.length = length;
        //     this.getList();
        // },
        // // 换页
        // currentChangeHandler(pageNo) {
        //     this.pagination.pageNo = pageNo;
        //     this.getList();
        // },
        // 柱形图
        drawZhuxing() {
            let that = this;
            let myCharts = echarts.init(document.getElementById("zhuxing"));
            myCharts.setOption({
                title: {
                    left: "center",
                    text: "厂家设备故障率统计表"
                },
                xAxis: {
                    name: "厂商",
                    type: "category",
                    nameTextStyle: {
                        fontSize: 20
                    },
                    data: that.xAxis
                },
                yAxis: {
                    name: "故障率",
                    type: "value",
                    nameTextStyle: {
                        fontSize: 20
                    }
                },
                series: [
                    {
                        data: that.series,
                        type: "bar",
                        showBackground: true,
                        backgroundStyle: {
                            color: "rgba(220, 220, 220, 0.8)"
                        }
                    }
                ]
            });
            window.addEventListener("resize", function() {
                myCharts.resize();
            });
        },
        //刷新图表
        refreshCharts() {
            console.log(4);
            var option = {
                legend: {},
                tooltip: {},
                dataset: {
                    source: this.data
                },
                xAxis: { type: "category" },
                //                xAxis: this.xAxis,
                yAxis: {},
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                //                series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
                series: [
                    {
                        data: this.series,
                        type: "bar",
                        showBackground: true,
                        backgroundStyle: {
                            color: "rgba(220, 220, 220, 0.8)"
                        }
                    }
                ]
            };
            if (myCharts == "" || myCharts == null || myCharts == undefined) {
                myCharts = echarts.init(document.getElementById("daymap"));
            }
            //            console.log(option, "option");
            myCharts.setOption(option);
        },
        //初始化图表--异步执行
        async initCharts() {
            await this.getList(); // 先执行
            this.drawZhuxing();
        }
    },
    //调用
    mounted() {
        //setTimeout(() => {
        //    this.drawZhe();
        //}, 2000);
    },
    created() {
        //        this.getList();
        this.initCharts();
        // 地区权限
        this.rolesId = localStorage.getItem("rolesId");
        this.units = JSON.parse(localStorage.getItem("units"));
        // console.log(this.units);
        this.provincearr = province; // 地区三级联动
        this.areaCodeProvince = this.units.areaCode.slice(0, 2) + "0000";
        this.areaCodeCity = this.units.areaCode.slice(0, 4) + "00";
        this.areaCategory = this.units.category;
        this.areaPower = this.units.power;
    }
};
</script>

<style scoped>
.demo-form-inline {
    white-space: nowrap;
    width: 100%;
}
.page-wrapper {
    height: 100%;
    width: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}
.top {
    display: flex;
    flex-direction: column;
}
.top > .el-form {
    height: 60px;
    flex-shrink: 0;
}
.top > .el-table {
    flex-grow: 1;
    overflow: auto;
    width: 95%;
}
/* .top > .el-pagination {height: 100px;flex-shrink: 0;text-align: center;} */
.bot {
    width: 100%;
    height: calc(100% - 100px);
    display: flex;
    flex-direction: column;
}
#zhuxing {
    width: 100%;
    height: 100%;
}
.zhuz {
    width: 100%;
    height: 50%;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
}
.biaoge {
    flex-grow: 1;
}
/* .map { height: 450px;width: 1200px;margin: 0 auto; } */
.form-item-btn {
    width: calc((90% - 975px) / 2);
}
.form-item-btn.one {
    text-align: left;
}
.form-item-btn.two {
    text-align: right;
}
.btn-query {
    float: right;
    margin-right: 20px;
    margin-bottom: 5px;
}
</style>
