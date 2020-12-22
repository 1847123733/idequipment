<template>
    <div class="page-wrapper clearfix">
        <div class="left">
            <div class="zhuxing">
                <h3 style="textAlign: center; marginBottom: 10px">今日实时业务量</h3>
                <div id="zhuxing"></div>
            </div>
            <div class="china">
                <h3 style="textAlign: center">设备分布图（贵州省）</h3>
                <div id="china"></div>
            </div>
        </div>
        <div class="right">
            <div class="zhexian">
                <h3 style="textAlign: center; marginBottom: 10px">近七日实时业务量趋势曲线</h3>
                <div id="zhexian"></div>
            </div>
            <div class="pie">
                <h3 style="textAlign: center; marginTop: 10px">今日业务量占比</h3>
                <div id="pie"></div>
            </div>
            <div class="table">
                <h3 style="textAlign: center; marginBottom: 10px">今日设备异常情况</h3>
                <div class="biaoge-data">
                    <div class="tablebox" style>
                        <!--表格的头部-->
                        <table
                            class="tou"
                            cellspacing="0px"
                            cellpadding="0px"
                            style="width: 100%;color: white"
                        >
                            <tr align="center" style>
                                <td style="width: 20%;height: 100%">设备编号</td>
                                <td style="width: 20%">设备类型</td>
                                <td style="width: 20%">放置单位</td>
                                <td style="width: 20%">类型</td>
                                <td style="width: 20%">异常项</td>
                            </tr>
                        </table>
                        <div class="biao">
                            <table ref="tableform"
                                id="tableId"
                                cellspacing="0px"
                                cellpadding="0px"
                                style="width: 100%;overflow: hidden;"
                                v-show="table.length==0?false:true"
                            >
                                <tr
                                    align="center"
                                    v-for="(item,i) in table"
                                    :key="i"
                                    style="color: white"
                                >
                                    <td style="width: 20%;height: 40px">{{ item.deviceid }}</td>
                                    <td style="width: 20%;height: 40px">
                                        <span v-if="item.device.devicetype === 1">拍照机</span>
                                        <span v-else-if="item.device.devicetype === 2">受理机</span>
                                        <span v-else-if="item.device.devicetype === 3">取证机</span>
                                        <span v-else-if="item.device.devicetype === 4">拍照受理一体机</span>
                                        <span v-else>其他</span>
                                    </td>
                                    <td style="width: 20%;height: 40px">{{item.device.unitName }}</td>
                                    <td style="width: 20%;height: 40px">
                                        <span v-if="item.type === 1">预警</span>
                                        <span v-else-if="item.type === 2">故障</span>
                                        <span v-else>其他</span>
                                    </td>
                                    <td style="width: 20%;height: 40px">
                                        <template>
                                            <!--{{item.exinfo}}-->
                                            <div v-if="item.exinfo === 'null'">无</div>
                                            <div v-else class="exinfo">
                                                <div v-if="item.exinfo.A01  === 0 ">
                                                    <div>打印机</div>
                                                </div>
                                                <div v-if="item.exinfo.A02  === 0 ">
                                                    <div>身份证读卡器</div>
                                                </div>
                                                <div v-if="item.exinfo.A03  === 0 ">
                                                    <div>相机</div>
                                                </div>
                                                <div v-if="item.exinfo.A04  === 0 ">
                                                    <div>监控摄像头</div>
                                                </div>
                                                <div v-if="item.exinfo.A05  === 0 ">
                                                    <div>左手特写摄像头</div>
                                                </div>
                                                <div v-if="item.exinfo.A06  === 0 ">
                                                    <div>右手特写摄像头</div>
                                                </div>
                                                <div v-if="item.exinfo.A07  === 0 ">
                                                    <div>左手指纹仪</div>
                                                </div>
                                                <div v-if="item.exinfo.A08  === 0 ">
                                                    <div>右手指纹仪</div>
                                                </div>
                                                <div v-if="item.exinfo.A09  === 0 ">
                                                    <div>拍照辅助照明</div>
                                                </div>
                                            </div>
                                        </template>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import echarts from "echarts";
import "echarts/map/js/china";
import "echarts/map/js/province/guizhou.js";
import obj from "echarts/map/json/province/guizhou.json";
import $ from "jquery";
import request from "@/utils/request";
export default {
    name: "realdata",
    data() {
        return {
            table: [],
            pie_legend: [],
            pie_series: [],
            pillar_source: [],
            stack_legend: [],
            stack_series: [],
            stack_xAxis: [],
            ciytData: []
        };
    },
    methods: {
        // 获取数据
        getList() {
            // 初始化图表--异步执行--需要加外层promise
            return new Promise((resolve, reject) => {
                let that = this;
                request({
                    url: "/chart/home",
                    method: "get",

                })
                    .then(function(response) {
                        resolve(response);

                        if (response.data.code === 20000) {
                            // console.log(3);

                            that.table = response.data.warnList;
                            that.pie_legend = response.data.pie_legend;
                            that.pie_series = response.data.pie_series;
                            that.pillar_source = response.data.pillar_source;

                            that.stack_legend = response.data.stack_legend;
                            that.stack_series = response.data.stack_series;
                            that.stack_xAxis = response.data.stack_xAxis;
                            that.ciytData = response.data.deviceMap;
                        }
                    })
                    .catch(function(error) {
                        console.log(error, "报错信息");
                        // reject(error);
                    });
            });
        },
        // 折线图
        drawZhexian() {
            let that = this;
            let myCharts = echarts.init(document.getElementById("zhexian"));
            myCharts.setOption({
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: that.stack_legend
                },
                grid: {
                    left: "3%",
                    right: "12%",
                    bottom: "3%",
                    containLabel: true
                },
                // toolbox: {
                //     feature: {
                //         saveAsImage: {}
                //     }
                // },
                xAxis: {
                    name: "日期",
                    nameTextStyle: {
                        fontSize: 20
                    },
                    type: "category",
                    boundaryGap: false,
                    data: that.stack_xAxis
                },
                yAxis: {
                    name: "数量 / 台",
                    nameTextStyle: {
                        fontSize: 20
                    },
                    type: "value"
                },
                series: that.stack_series
            });
            window.addEventListener("resize", function() {
                myCharts.resize();
            });
        },
        // 柱形图
        drawZhuxing() {
            let that = this;
            let myCharts = echarts.init(document.getElementById("zhuxing"));
            myCharts.setOption({
                legend: {},
                tooltip: {},
                grid: {
                    left: "5%",
                    right: "15%",
                    bottom: "4%",
                    containLabel: true
                },
                dataset: {
                    source: that.pillar_source
                },
                xAxis: {
                    name: "设备类型",
                    nameTextStyle: {
                        fontSize: 20
                    },
                    type: "category"
                },
                yAxis: {
                    name: "数量 / 台",
                    nameTextStyle: {
                        fontSize: 20
                    }
                },
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
            });
            window.addEventListener("resize", function() {
                myCharts.resize();
            });
        },
        // 中国地图
        drawChina() {
            let that = this;
            let myCharts = echarts.init(document.getElementById("china"));
            myCharts.setOption({
                backgroundColor: "#f0f0f0",
                geo: {
                    map: "贵州",
                    label: {
                        normal: {
                            textStyle: {
                                color: "#000",
                                fontSize: "12",
                                fontFamily: "微软雅黑"
                            },
                            show: true //  是否显示字体
                        }, //  滑过显示样式
                        emphasis: {
                            textStyle: {
                                color: "#92b1d8",
                                fontSize: "12",
                                fontFamily: "微软雅黑"
                            },
                            show: true
                        }
                    },
                    left: "18%",
                    roam: true,
                    itemStyle: {
                        normal: {
                            areaColor: "#488FC3",
                            borderColor: "#3EDDE9"
                        },
                        emphasis: {
                            areaColor: "#324D95"
                        }
                    }
                },
                series: [
                    {
                        name: "one",
                        type: "effectScatter",
                        coordinateSystem: "geo",
                        data: that.ciytData
                    }
                ]
            });
            window.addEventListener("resize", function() {
                myCharts.resize();
            });
        },
        // 饼图
        drawPie() {
            let that = this;
            let myCharts = echarts.init(document.getElementById("pie"));
            myCharts.setOption({
                tooltip: {
                    trigger: "item"
                },
                legend: {
                    orient: "vertical",
                    right: 30,
                    top: 40,
                    bottom: 20,
                    data: that.pie_legend,
                    itemWidth: 20, //图例的宽度
                    itemHeight: 20, //图例的高度
                    textStyle: {
                        //图例文字的样式
                        color: "#000"
                    }
                },
                series: [
                    {
                        name: "",
                        type: "pie",
                        radius: "80%",
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
                        data: that.pie_series,
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    //自定义颜色
                                    let colorList = [
                                        "#00FFFF",
                                        "#FF0115",
                                        "#FFFF00",
                                        "#FF8C00",
                                        "#C869DB"
                                    ];
                                    return colorList[params.dataIndex];
                                }
                            }
                        }
                    }
                ]
            });
            window.addEventListener("resize", function() {
                myCharts.resize();
            });
        },
        //表格滚动
        scroll1() {
            this.$nextTick(() => {
                // console.log(11111111)
                let reset = 1;
                let shu = this.table.length;
//                let lenter = document.getElementById(tableId);
                let lenter = this.$refs.tableform;
                let tableheight = lenter.offsetHeight;
//                console.log(lenter.offsetHeight);
                let trheight = tableheight / shu;
                setInterval(() => {
                    // console.log(11111111)
                    reset += 1;

                    $("#tableId").animate(
                        {
//                            marginTop: "-=40px"
                              marginTop: `-=${trheight}px`
                        },
                        2500,
                        function() {
                            // console.log(11111111)
                            if (reset > shu) {
                                // console.log(11111111)
                                reset = 1;
                                $("#tableId").css("margin-top", "0%");
                            }
                        }
                    );
                }, 4000);
            });
        },
        //初始化图表--异步执行
        async initCharts() {
            await this.getList(); // 先执行
            this.scroll1();
            this.drawZhexian();
            this.drawZhuxing();
            this.drawChina();
            this.drawPie();
        }
    },
    mounted() {
        // this.drawZhexian();
        // this.drawZhuxing();
        // this.drawChina();
        // this.drawPie();
    },
    created() {
        // this.scroll1();
        this.initCharts();
    }
};
</script>

<style scoped>
.exinfo {

}
.exinfo>div {
    margin: 10px 0;
}
.page-wrapper {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
}
.left {
    width: 50%;
    height: 100%;
    float: left;
}
.left > div {
    height: 50%;
    width: 100%;
}
.right {
    width: 50%;
    height: 100%;
    float: left;
}
.right > div {
    height: 33%;
}
.zhexian {
    width: 100%;
    height: 100%;
}
#zhexian {
    width: 100%;
    height: 90%;
}
.zhuxing {
    width: 100%;
    height: 100%;
}
#zhuxing {
    width: 100%;
    height: 80%;
}
.pie {
    width: 100%;
    height: 100%;
}
#pie {
    width: 100%;
    height: 85%;
}
.china {
    width: 100%;
    height: 100%;
}
#china {
    width: 100%;
    height: 100%;
}
.circle {
    width: 80%;
    height: 150px;
}
.tou {
    height: 10%;
    /* flex-shrink: 0; */
}
.biao {
    width: 100%;
    height: 90%;
    /* flex-shrink: 0; */
    overflow: hidden;
}
.biaoge-data {
    width: 80%;
    height: 260px;
    margin: 0 auto;
    /* flex-shrink: 0; */
    padding: 10px 0px 0px 0px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.8);
    overflow: hidden;
}
.tablebox {
    overflow: hidden;
    /* border: 1px solid rgb(0, 0, 0); */
    width: 100%;
    height: 100%;
    /* display: flex; */
    /* flex-direction: column; */
}
.tablebox > div > table > tr > td {
    border: 1px solid rgb(0, 0, 0);
}
</style>
