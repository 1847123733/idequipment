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
                <el-form-item class="form-item-select" label="时间段">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="searchForm.startTime"
                        type="date"
                        placeholder="开始时间"
                    ></el-date-picker>-
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="searchForm.endTime"
                        type="date"
                        placeholder="截止时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item class="form-item-btn one">
                    <el-button class="btn-query" type="primary" @click="querySubmit">搜索</el-button>
                    <input style="margin-left: 20px;color: #FF0000" value="默认显示最近7天数据" readonly />
                    <!-- <el-button class="btn-query" @click="exportExcel" type="success">导出</el-button> -->
                </el-form-item>
            </el-form>
            <!-- 内容表格 -->
            <div class="tab-top">
                <!-- <h3 class="hegel">拍照合格率 (四舍五入保留小数点后两位)</h3> -->
                <el-button class="btn-query" @click="exportExcel" type="success">导出</el-button>
            </div>
            <el-table id="exportTab" :data="list" border :header-cell-style="{background:'rgba(203,227,251,0.6)',color:'rgb(76,164,255)'}">
                <!-- 循环展示表格的列和数据 -->
                <el-table-column
                    v-for="(item, index) in title"
                    :key="index"
                    :property="item.key"
                    :label="item.label"
                    align="center"
                >
                    <template slot-scope="scope">
                        <!--当前行属性对应的值-->
                        {{scope.row[scope.column.property]}}
                        <!-- 渲染对应表格里面的内容 -->
                    </template>
                </el-table-column>
            </el-table>
            <!-- <el-pagination
          @size-change="sizeChangeHandler"
          @current-change="currentChangeHandler"
          :current-page="pagination.pageNo"
          :page-size="pagination.length"
          layout="total, prev, pager, next, jumper"
          :total="pagination.total"
            ></el-pagination>-->
        </div>
        <div class="bot clearfix">
            <!--折线图-->
            <div id="zhexiant1"></div>
            <!--饼图-->
            <div id="piet1"></div>
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
var myChartsZhe;
var myChartsPie;
import { province, map } from "@/assets/area";
export default {
    name: "acceptbusiness",
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
            title: [], //表格标题
            list: [], // 表格数据
            pie_legend: [], //饼图图例
            pie_series: [], //饼图数据
            stack_legend: [], //折线图图例
            stack_series: [], //折线图数据
            stack_xAxis: [], //折线图横坐标

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
                    `${
                        (this.querySubmitForm.startTime === "" ||
                            this.querySubmitForm.startTime === null) &&
                        (this.querySubmitForm.endTime === "" ||
                            this.querySubmitForm.endTime === null)
                            ? "拍照受理一体表（默认最近七天数据).xlsx"
                            : "拍照受理一体表（" +
                              this.querySubmitForm.startTime +
                              "---" +
                              this.querySubmitForm.endTime +
                              ").xlsx"
                    }`
                    // "受理表.xlsx"
                );
            } catch (e) {
                if (typeof console !== "undefined") {
                    console.log(e, wbout);
                }
            }
            return wbout;
        },
        // 获取数据
        getList() {
            // 初始化图表--异步执行--需要加外层promise
            return new Promise((resolve, reject) => {
                let that = this;
                request({
                    url: "/chart/allinone",
                    method: "get",
                    params: {
                        ...that.querySubmitForm
                    }
                })
                    .then(function(response) {
                        resolve(response);

                        if (response.data.code === 20000) {
                            // console.log(3);

                            that.title = response.data.title;
                            that.list = response.data.data;
                            that.pie_legend = response.data.pie_legend;
                            that.pie_series = response.data.pie_series;
                            that.stack_legend = response.data.stack_legend;
                            that.stack_series = response.data.stack_series;
                            that.stack_xAxis = response.data.stack_xAxis;
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
            //        console.log(1);
            this.querySubmitForm = Object.assign({}, this.searchForm);
            //        console.log(2);
            await this.getList(); // 先获取数据 在刷新表
            this.drawZhexian();
            this.drawPie();
            //        this.refreshChartsZhe();
            //        this.refreshChartsPie();
        },
        // 饼图
        drawPie() {
            let that = this;
            let myChartsPie = echarts.init(document.getElementById("piet1"));
            myChartsPie.setOption(
                {
                    title: {
                        left: "center",
                        text: "业务总量厂家占比"
                    },
                    tooltip: {
                        trigger: "item"
                    },
                    legend: {
                        // orient: "vertical",
                        left: 100,
                        top: 400,
                        bottom: 20,
                        data: that.pie_legend,
                        itemWidth: 15, //图例的宽度
                        itemHeight: 15, //图例的高度
                        textStyle: {
                            //图例文字的样式
                            color: "#000"
                        }
                    },
                    series: [
                        {
                            name: "人员统计",
                            type: "pie",
                            radius: "70%",
                            center: ["50%", "50%"],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: "center"
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: that.pie_series
                        }
                    ]
                },
                true
            );
            window.addEventListener("resize", function() {
                myChartsPie.resize();
            });
        },
        // 折线图
        drawZhexian() {
            let that = this;
            let myChartsZhe = echarts.init(
                document.getElementById("zhexiant1")
            );
            myChartsZhe.setOption(
                {
                    title: {
                        left: "center",
                        text: "拍照受理一体业务总量趋势"
                    },
                    tooltip: {
                        trigger: "axis"
                    },
                    legend: {
                        // left: 100,
                        top: 30,
                        // bottom: 20,
                        data: that.stack_legend
                    },
                    grid: {
                        left: "3%",
                        right: "6%",
                        bottom: "0%",
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        name: "日期",
                        type: "category",
                        boundaryGap: false,
                        nameTextStyle: {
                            fontSize: 20
                        },
                        data: that.stack_xAxis
                    },
                    yAxis: {
                        name: "总量",
                        type: "value",
                        nameTextStyle: {
                            fontSize: 20
                        }
                    },
                    series: that.stack_series
                },
                true
            );
            window.addEventListener("resize", function() {
                myChartsZhe.resize();
            });
        },
        //刷新图表-折线图
        refreshChartsZhe() {
            let that = this;
            //        console.log(4);
            var option = {
                title: {
                    left: "center",
                    text: "受理业务总量趋势"
                },
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    // left: 100,
                    top: 30,
                    // bottom: 20,
                    data: that.stack_legend
                },
                grid: {
                    left: "3%",
                    right: "6%",
                    bottom: "0%",
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    name: "日期",
                    type: "category",
                    boundaryGap: false,
                    nameTextStyle: {
                        fontSize: 20
                    },
                    data: that.stack_xAxis
                },
                yAxis: {
                    name: "总量",
                    type: "value",
                    nameTextStyle: {
                        fontSize: 20
                    }
                },
                series: that.stack_series
            };
            if (
                myChartsZhe == "" ||
                myChartsZhe == null ||
                myChartsZhe == undefined
            ) {
                myChartsZhe = echarts.init(
                    document.getElementById("zhexiant1")
                );
            }
            console.log(option, "option");
            myChartsZhe.clear();
            myChartsZhe.setOption(option, true);
        },
        //刷新图表-饼图
        refreshChartsPie() {
            let that = this;
            console.log(4);
            var option = {
                title: {
                    left: "center",
                    text: "业务总量厂家占比"
                },
                tooltip: {
                    trigger: "item"
                },
                legend: {
                    // orient: "vertical",
                    left: 100,
                    top: 400,
                    bottom: 20,
                    data: that.pie_legend,
                    itemWidth: 15, //图例的宽度
                    itemHeight: 15, //图例的高度
                    textStyle: {
                        //图例文字的样式
                        color: "#000"
                    }
                },
                series: [
                    {
                        name: "人员统计",
                        type: "pie",
                        radius: "70%",
                        center: ["50%", "50%"],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: "center"
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: that.pie_series
                    }
                ]
            };
            if (
                myChartsPie == "" ||
                myChartsPie == null ||
                myChartsPie == undefined
            ) {
                myChartsPie = echarts.init(document.getElementById("piet1"));
            }
            console.log(option, "option");
            myChartsPie.clear();
            myChartsPie.setOption(option, true);
        },
        //初始化图表--异步执行
        async initCharts() {
            await this.getList(); // 先执行
            this.drawZhexian();
            this.drawPie();
        }
    },
    created() {
        //this.getList();
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
    margin-bottom: 15px;
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

.top > .el-pagination {
    height: 100px;
    flex-shrink: 0;
    text-align: center;
}

.bot > div {
    float: left;
}
#zhexiant1 {
    width: 60%;
    height: 450px;
}
#piet1 {
    width: 40%;
    height: 450px;
}

/* .map {
      height: 450px;
      width: 1200px;
      margin: 0 auto;
  } */
.form-item-btn {
    width: calc((90% - 975px) / 2);
}
.form-item-btn.one {
    text-align: left;
}
.form-item-btn.two {
    text-align: right;
}
.tab-top {
    text-align: right;
}
</style>
