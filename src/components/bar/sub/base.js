/**
 * Created by yelingfeng on 2016/10/14.
 */

// 处理为正反option
function changeOption(option) {
    option.xAxis[0] = {
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
    option.tooltip.axisPointer.shadowStyle = {
        shadowBlur: 1
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
function setting(option, props) {
    debugger;
    // option.barMaxWidth = barMaxWidth
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
    return option;
}

export default {
    setting
}
