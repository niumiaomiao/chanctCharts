/**
 * Created by zhao on 2016/12/3.
 */
import {barMaxWidth} from '../../../config/barConfig'
import * as config from '../../../config/commonConfig'
import {
    changeAxis
} from '../../../props'

/**
 * 处理分组堆积图 排序显示问题
 * @param seriesObj
 * @param data  元数据
 * @param sortType 排序字段
 */
function sortSeriesHelper(seriesObj, data, sortType) {
    // 默认降序
    let _sortType = sortType || 'desc';
    let s = seriesObj.series;
    let x = seriesObj.xAxis;
    let d = data;
    // 按name分组求value合 之后 按value大小排序
    let newAxis = _.chain(data)
        .groupBy(function(it) {
            return it.name
        })
        .map(function(group, name) {
            let sum = 0;
            _.each(group, function(it) {
                sum += it.value
            })
            return {
                name: name,
                value: sum
            }
        })
        .orderBy('value', _sortType)
        .map(function(it) {
            return it.name
        })
        .value();
    s.forEach(function(it) {
        let data = it.data;
        let newData = [];
        newAxis.forEach(function(it) {
            data.forEach(function(od) {
                if (it === od.name) {
                    newData.push(od)
                }
            })
        })
        it.data = newData
    })
    let xAxisArr = []
    if (s instanceof Array && s.length >= 0) {
        s[0].data.forEach(item => {
            xAxisArr.push(item.name)
        })
    }
    return {series: s, xAxis: xAxisArr}
}

function setOption(option, props, data) {
    // var re = sortSeriesHelper(option,data,'desc')
    // let splitLine = getSplitLine()
    // let axisLabel = getAxisLabel(props)
    // let xName = getAxisName(props, 'xName', 'xUnit')
    // let yName = getAxisName(props, 'ylName', 'ylUnit')
    // let maxMin = axisMaxmin(option.data, props)
    // let lineStyle = getAxisLine(props)
    // re.series.forEach((item)=>{
    //     item.data.reverse()
    // })
    // option.series = re.series
    option = changeAxis(option)
    // option.yAxis[0].data = re.xAxis.reverse()
    //
    if (option.series instanceof Array && option.series.length !== 0 && option.series[0].data) {
        let _d = option.series[0].data;
        if (_d.length) {
            option.series.forEach((item, index) => {
                if (option.series[index].data) {
                    option.series[index].data = _.reverse(option.series[index].data)
                }
            })
            if (option.yAxis[0].data) {
                option.yAxis[0].data = _.reverse(option.yAxis[0].data)
            }
        }
    }

    return option
}

/**
 *
 * 处理返回option
 * @param gop 分组处理后的op 包括{category: Array, xAxis: Array, series: Array}
 * @param props
 * @returns Object
 */
function setting(option, props, data) {
    let specialProp = props.specialProp['bar']
    option.barMaxWidth = barMaxWidth
    option = setOption(option, props, data)
    if (option.series.length) {
        option.series.forEach(it => {
            it.itemStyle = {
                emphasis: {
                    color: specialProp.hoverColor
                }
            }
        })
    }
    option.tooltip['formatter'] = function(params) {
        let res = params[0].name;
        let box;
        box = '<div style="position: relative;">'
        box += '<span  class="df-tooltip__span  df-tooltip__row1 " ></span>'
        box += '<span  class="df-tooltip__span  df-tooltip__row2 " ></span>'
        box += '<span  class="df-tooltip__span  df-tooltip__col1 " ></span>'
        box += '<span  class="df-tooltip__span  df-tooltip__col2 " ></span>'
        res += '</br>'
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
    if (option.xAxis instanceof Array) {
        option.xAxis.forEach(item => {
            item.max = null
            item.min = null
        })
    }
    return option;
}

export default {
    setting
}
