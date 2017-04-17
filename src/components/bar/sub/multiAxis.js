/**
 * Created by zhao on 2016/12/2.
 */
import { barMaxWidth, barHoverColor } from '../../../config/barConfig'
import * as config from '../../../config/commonConfig'
import { dbYAxisMaxMin } from '../../../props'

function addNullData(xAxis, data) {
    // xAxis是x轴data   data是series
    if (xAxis instanceof Array && data instanceof Array && xAxis.length !== data.length) {
        let dataNameArr = []
        data.forEach(function(dItem) {
            dataNameArr.push(dItem.name)
        })
        xAxis.forEach(function(xItem, index) {
            if (_.indexOf(dataNameArr, xItem) === -1) {
                let obj = {
                    name: xItem,
                    value: null
                }
                let left = data.slice(0, index)
                let right = data.slice(index)
                left.push(obj)
                data = left.concat(right)
            }
        })
    }
    return data
}

function setOption(option, props) {
    let opt = option
    let yAxis = {}
    for (let k in opt.yAxis[0]) {
        if (k !== 'splitLine') {
            yAxis[k] = opt.yAxis[0][k]
        } else {
            yAxis['splitLine'] = {
                show: false
            }
        }
    }
    yAxis.name = props.axisProps.yrName + props.axisProps.yrUnit
    opt.yAxis.push(yAxis)
    opt.series.forEach(e => {
        if (e.data.length > 0 && e.data[0].dataObj) {
            if (e.data[0].dataObj.type) {
                e.type = e.data[0].dataObj.type
                if (e.type === 'line') {
                    e['yAxisIndex'] = 1
                    e.data[0].dataObj.yIndex = '1'
                    e.data = addNullData(opt.xAxis[0].data, e.data)
                } else {
                    e.data[0].dataObj.yIndex = '0'
                }
            }
        }
    })

    return opt
}

/**
 *
 * 处理返回option
 * @param gop 分组处理后的op 包括{category: Array, xAxis: Array, series: Array}
 * @param props
 * @returns Object
 */
function setting(option, props) {
    option.barMaxWidth = barMaxWidth
    option = setOption(option, props)
    return option;
}

export default {
    setting
}
