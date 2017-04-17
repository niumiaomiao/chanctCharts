import {
    getTooltip,
    getAxisLabel,
    getAxisLine,
    getAxisName,
    changeAxis,
    getGirdOption
} from '../../../props'

import {barMaxWidth, barHoverColor, barColorList as barColors} from '../../../config/barConfig'

// 引用通用样式
let gridOp = {}
let axisLabel = getAxisLabel()
let axisLine = getAxisLine()

/**
 * 创建series
 * @param data
 * @returns {Array}
 */
function createSeries(data, props) {
    let _colors;
    // 小于30个数据   截取30 - len数组
    if (data.length < 30) {
        _colors = _.drop(barColors, 30 - data.length);
    } else {
        _colors = barColors;
    }
    let axis = [];
    let series = [];
    let seriesObj = {};
    seriesObj.type = 'bar';
    seriesObj.data = [];
    seriesObj.itemStyle = {
        normal: {
            color: function(params) {
                let color = _colors[params.dataIndex];
                if (color === undefined) {
                    let index = params.dataIndex % (_colors.length - 1);
                    color = _colors[index - 1]
                }
                return color;
            }
        }
    }
    let dt = data.slice(0).reverse();
    dt.forEach(it => {
        if (it.ordernum) {
            axis.push(it.ordernum);
        } else {
            axis.push(it.name);
        }
        seriesObj.data.push({
            value: it.value,
            desc: it.name,
            name: it.name,
            info: it.info || '',
            dataObj: it,
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: function(v) {
                        if (v.data.value) {
                            // return v.data.desc + " " + v.data.value;
                            return v.data.desc;
                        }
                    },
                    textStyle: {
                        color: '#00CAE5'
                    }
                },
                emphasis: {
                    show: true
                }
            }
        });
    })
    series.push(seriesObj)
    return {
        series,
        axis
    };
}

// function getConfig(obj, props) {
//   let series;
//   let axis;
//   if (obj !== undefined) {
//     series = obj.series;
//     axis = obj.axis;
//   }
//   else {
//     series = [];
//     axis = ['无数据']
//   }
//
//   gridOp = getGirdOption(props)
// debugger
//   var option = {
//     tooltip: getTooltip(),
//     grid: gridOp,
//     xAxis: [{
//       name: '',
//       axisLine: axisLine,
//       type: 'value',
//       axisLabel: axisLabel,
//       scale: true,
//       splitLine: {
//         show: false
//       },
//       splitArea: {
//         show: false
//       },
//       splitNumber: 10,
//       splitLine: {show: false},
//     }],
//     yAxis: [{
//       type: 'category',
//       axisLine: axisLine,
//       boundaryGap: true,
//       axisTick: {onGap: false},
//       splitLine: {show: false},
//       data: axis,
//       axisLabel: {
//         interval: 0,
//         textStyle: axisLabel.textStyle
//       }
//     }],
//     series: series
//   }
//   return option;
// }

function setOption(opt, props, data) {
    let option = opt
    option = changeAxis(option)
    let json = createSeries(data, props)
    option.series = json.series
    option.yAxis[0].data = json.axis
    option.tooltip['formatter'] = function(params) {
        let res = '';
        let box;
        box = '<div style="position: relative;">'
        box += '<span  class="df-tooltip__span  df-tooltip__row1 " ></span>'
        box += '<span  class="df-tooltip__span  df-tooltip__row2 " ></span>'
        box += '<span  class="df-tooltip__span  df-tooltip__col1 " ></span>'
        box += '<span  class="df-tooltip__span  df-tooltip__col2 " ></span>'
        if (params[0].data.dataObj && params[0].data.dataObj.info) {
            res += params[0].data.dataObj.info
        } else {
            params.forEach(item => {
                res += item.seriesName + ' : ' + Math.abs(item.value || 0) + props.axisProps.xUnit
                res += '</br>'
            })
        }
        box += res
        box += '</div>'
        return box
    }
    option.yAxis[0].axisLabel.interval = 0
    return option
}

/**
 * 水平横向柱图 倒叙排列 显示text在柱上
 * @param data
 * @param props 属性配置项
 */
function setting(option, props, data) {
    let specialProp = props.specialProp['bar']
    option.barMaxWidth = barMaxWidth
    option = setOption(option, props, data)
    option.series[0].barWidth = props.specialProp.bar.width
    if (option.series.length) {
        option.series.forEach(it => {
            it.itemStyle = {
                emphasis: {
                    color: specialProp.hoverColor
                }
            }
        })
    }
    return option;
}

export default {
    setting
}
