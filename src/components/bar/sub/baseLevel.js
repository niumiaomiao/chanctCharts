/**
 * Created by zhao on 2016/12/27.
 */
import {barMaxWidth} from '../../../config/barConfig'
import {
    changeAxis
} from '../../../props'

// 处理为正反option
function changeOption(option) {
    let opt = option
    opt.xAxis[0] = {
        data: option.xAxis[0].data,
        name: option.xAxis[0].name,
        axisLine: {
            show: false,
            lineStyle: {
                color: 'rgba(0,0,0,0)'
            }
        },
        nameTextStyle: {
            color: '#36D4C7'
        },
        axisLabel: option.xAxis[0].axisLabel
    }
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
    let specialProp = props.specialProp['bar']
    let length
    if (specialProp.colorList.length) {
        length = specialProp.colorList.length
    }
    let i = 0
    if (option.series.length) {
        option.series[0].data.forEach(it => {
            it.itemStyle = {
                normal: {
                    color: specialProp.colorList[i]
                }
            }
            i++
            if (i === length) {
                i = 0
            }
        })
    }
    option = changeOption(option)
    option = changeAxis(option)

    let _d = option.series[0].data;
    if (_d.length) {
        option.series[0].data = _.reverse(option.series[0].data)
        option.yAxis[0].data = _.reverse(option.yAxis[0].data)
    }

    return option;
}

export default {
    setting
}
