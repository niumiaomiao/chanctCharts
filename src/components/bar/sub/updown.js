/**
 * Created by zhao on 2016/12/2.
 */
import {barMaxWidth} from '../../../config/barConfig'

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
function setting(option) {
    option.barMaxWidth = barMaxWidth
    option = changeOption(option)
    return option;
}

export default {
    setting
}
