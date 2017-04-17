/**
 * Created by yelingfeng on 2016/10/14.
 */

/**
 *
 * 处理返回option
 * @param gop 分组处理后的op 包括{category: Array, xAxis: Array, series: Array}
 * @param props
 * @returns Object
 */
function setting(option) {
    if (option.yAxis instanceof Array) {
        option.yAxis.forEach(item => {
            item.max = null
            item.min = null
        })
    }
    return option;
}

export default {
    setting
}
