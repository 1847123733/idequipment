<template>
    <div class="box">
        <div class="legend">
            <div class="zaixian">
                <span></span>
                <span>在线</span>
            </div>
            <div class="lixian">
                <span></span>
                <span>离线</span>
            </div>
            <div class="yichang">
                <span></span>
                <span>异常</span>
            </div>
        </div>
        <div id="boxMap"></div>
    </div>
</template>



<script type="text/ecmascript-6">
import echarts from "echarts";
import "echarts/map/js/province/guizhou.js";
import obj from "echarts/map/json/province/guizhou.json";
import request from "@/utils/request";
export default {
    name: "realtimeMode", // 设备实时状态监控
    data() {
        return {
            ciytData: [],
            geoCoordMap: [],
            infoData: [],
            timer:null,
            ywxl:[]
        };
    },
    methods: {
        // 获取数据
        getList() {
            // 初始化图表--异步执行--需要加外层promise
            return new Promise((resolve, reject) => {
              let that = this;
              request({
                url: "/sysDevice/state",
                method: "get"
              })
                .then(function(response) {
                  resolve(response);

                  if (response.data.code === 20000) {
                    // console.log(3);
                    that.ciytData = response.data.colourData;
                    that.geoCoordMap = response.data.geoCoordMap;
                    that.infoData = response.data.infoData;
                  }
                })
                .catch(function(error) {
                  console.log(error, "报错信息");
                  // reject(error);
                });
            })


        },
        //   地图
        CityMap() {
            let that = this;
            var myChartCity = echarts.init(document.getElementById("boxMap"));
            var resO = [];
            var resT = [];
            var resS = [];
            var convertData = function(data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].value === "ST010") {
                        var geoCoordO = that.geoCoordMap[i][data[i].name];
                        if (geoCoordO) {
                            resO.push({
                                name: data[i].name,
                                value: geoCoordO.concat(data[i].value),
                                obcity: geoCoordO // 自定义数据
                            });
                        }
                    } else if (data[i].value === "ST020") {
                        var geoCoordT = that.geoCoordMap[i][data[i].name];
                        if (geoCoordT) {
                            resT.push({
                                name: data[i].name,
                                value: geoCoordT.concat(data[i].value),
                                obcity: geoCoordT // 自定义数据
                            });
                        }
                    } else if (data[i].value === "ST030") {
                        var geoCoordS = that.geoCoordMap[i][data[i].name];
                        if (geoCoordS) {
                            resS.push({
                                name: data[i].name,
                                value: geoCoordS.concat(data[i].value),
                                obcity: geoCoordS // 自定义数据
                            });
                        }
                    }
                }
            };
            convertData(that.ciytData); // 筛选数据

            var optionCity = {
                title: {
                    left: "center",
                    top: "20",
                    text: "",
                    textStyle: {
                        //文字颜色
                        color: "#000",
                        //字体风格,'normal','italic','oblique'
                        // fontStyle:'normal',
                        //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                        fontWeight: "bold",
                        //字体系列
                        // fontFamily:'sans-serif',
                        //字体大小
                        fontSize: 26
                    }
                },
                backgroundColor: "rgba(250,236,216,0.5)",
                tooltip: {
                    trigger: "item",
                    borderRadius: 0,
                    backgroundColor: "rgba(8,65,134,0.9)",
                    formatter: function(p) {
                        var a = p.name;
                        // console.log(p)
                        for (let i = 0; i < that.infoData.length; i++) {
                            // console.log(that.infoData[i]);
                            if (a === Object.keys(that.infoData[i])[0]) {
                                // console.log(Object.keys(that.infoData[i])[0]);
                              let obj = that.infoData[i][a];
                                console.log(obj,3333)
                                let text = `
                                设备编号：<span style='color:#f0921e'> ${
                                    obj.deviceid
                                }</span></br>
                                放置单位：<span style='color:#f0921e'> ${
                                    obj.unitName
                                }</span></br>
                                设备所在地行政区划：<span style='color:#f0921e'> ${
                                    obj.areaName
                                }</span></br>
                                设备地址：<span style='color:#f0921e'> ${
                                    obj.address
                                }</span></br>
                                厂商：<span style='color:#f0921e'> ${
                                    obj.factorName
                                }</span></br>
                                状态：</br>
                                 `;
                              for(let item in obj.component) {
                                text+=`
                                    <div>
                                        <div>
                                          <span>
                                             ${that.ywxl.map(item1 =>{
                                                if (item1.code == item){
                                                  // console.log(item1.name,4444)
                                                  return `${item1.name}`
                                                }
                                              }).join('')}
                                           </span>
                                           <span style='color:#f0921e'>：${obj.component[item] === 1? '正常':'异常'}</span>
                                        </div>

                                      </div>

                                  `;
                                }
                                return text;
                            }
                        }
                    }
                },
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
                                color: "#000",
                                fontSize: "12",
                                fontFamily: "微软雅黑"
                            },
                            show: true
                        }
                    },
                    zoom: 1.5,
                    top: '11%',
                    left: "18%",
                    roam: true,
                    itemStyle: {
                        normal: {
                         areaColor: "rgba(8,65,134, 0.7)",
//                          borderColor: "#3EDDE9"
                        },
                        emphasis: {
                           areaColor: "rgba(8,65,134, 0.8)",
                        }
                    }
                },
                series: [
                    {
                        name: "one",
                        type: "effectScatter",
                        coordinateSystem: "geo",
                        data: resO,
                        symbolSize: 20,
                        showEffectOn: "render",
                        rippleEffect: {
                            brushType: "stroke"
                        },
                        hoverAnimation: true,
                        itemStyle: {
                            normal: {
                                color: "#35a165",
                                shadowBlur: 0,
                                shadowColor: "#35a165"
                            }
                        },
                        zlevel: 1,
                        label: {
                            normal: {
                                formatter: "{b}",
                                position: "bottom",
                                show: true,
                                textStyle: {
                                    color: "#35a165",
                                    fontSize: "14",
                                    fontFamily: "微软雅黑"
                                }
                            },
                            emphasis: {
                                show: true
                            }
                        }
                    },
                    {
                        name: "two",
                        type: "effectScatter",
                        coordinateSystem: "geo",
                        data: resT,
                        symbolSize: 20,
                        showEffectOn: "render",
                        rippleEffect: {
                            brushType: "stroke"
                        },
                        hoverAnimation: true,
                        itemStyle: {
                            normal: {
                                color: "#ef931c",
                                shadowBlur: 0,
                                shadowColor: "#ef931c"
                            }
                        },
                        zlevel: 1,
                        label: {
                            normal: {
                                formatter: "{b}",
                                position: "bottom",
                                show: true,
                                textStyle: {
                                    color: "#ef931c",
                                    fontSize: "14",
                                    fontFamily: "微软雅黑"
                                }
                            },
                            emphasis: {
                                show: true
                            }
                        }
                    },
                    {
                        name: "three",
                        type: "effectScatter",
                        coordinateSystem: "geo",
                        data: resS,
                        symbolSize: 20,
                        showEffectOn: "render",
                        rippleEffect: {
                            brushType: "stroke"
                        },
                        hoverAnimation: true,
                        itemStyle: {
                            normal: {
                                color: "#e63f3f",
                                shadowBlur: 0,
                                shadowColor: "#e63f3f"
                            }
                        },
                        zlevel: 1,
                        label: {
                            normal: {
                                formatter: "{b}",
                                position: "bottom",
                                show: true,
                                textStyle: {
                                    color: "#e63f3f",
                                    fontSize: "14",
                                    fontFamily: "微软雅黑"
                                }
                            },
                            emphasis: {
                                show: true
                            }
                        }
                        // symbolSize: function(val) {
                        //     return val[1] / 2; //用值的大小来调整点的大小
                        // }
                    }
                ]
            };
            myChartCity.setOption(optionCity);
            // myChartCity.on("click", function(params) {
            // if (params.componentType == "series") {
            // console.log(params);
            // alert(params.data.obcity);
            // window.open(
            //     "twoMap.html",
            //     "newwindow",
            //     "height=600, width=1300, toolbar =no, menubar=no, scrollbars=yes, resizable=yes, location=no, status=no"
            // );
            // }
            // });
        },
        // 初始化图表--异步执行
        async initCharts() {

            await this.getList(); // 先执行
            this.CityMap();
        },

        // 获取业务
        getDataxiaol(){
        let that = this;
        request({
          url: "/sysParm",
          method: "get",
          params: {

            typeCode:'01'
          }
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.ywxl = response.data.data;
              // that.list = response.data.data;
              // that.pagination.total = response.data.recordsTotal;
              console.log(response,222)
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
    },
    mounted() {
        // this.CityMap();
    },
    created() {
        this.initCharts();
        this.getDataxiaol();
        this.timer = window.setInterval(() =>{
          setTimeout(() =>{
            this.initCharts();
          },0)
        },30000)
    },
  beforeDestroy() {
      if(this.timer){
        clearInterval(this.timer);
      }

  }
};
</script>

<style scoped>
.box {
    width: 100%;
    height: 100%;
    position: relative;
}
#boxMap {
    height: 100%;
    width: 100%;
}
.legend {
    position: fixed;
    top: 100px;
    right: 100px;
    color: #000;
    z-index: 100;
}
.legend > div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
    font-size: 20px;
}
.zaixian > span:first-child {
    display: inline-block;
    width: 50px;
    height: 25px;
    background-color: #35a165;
    margin-right: 10px;
}
.lixian > span:first-child {
    display: inline-block;
    width: 50px;
    height: 25px;
    background-color: #ef931c;
    margin-right: 10px;
}
.yichang > span:first-child {
    display: inline-block;
    width: 50px;
    height: 25px;
    background-color: #e63f3f;
    margin-right: 10px;
}
</style>
