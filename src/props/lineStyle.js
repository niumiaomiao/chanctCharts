/**
 * Created by yelingfeng on 2016/8/24.
 */
import echarts from 'echarts'

/**
 * 线性渐变色处理
 * @returns {*}
 */
export function getLinearGradient() {
    return new echarts.graphic.LinearGradient(
        0, 0, 1000, 500,
        // 0% 处的颜色 // 100% 处的颜色
        [
            {offset: 0, color: 'rgba(0, 218, 253,0.5)'},
            {offset: 1, color: 'rgba(0, 245, 212,0.5)'}
        ]
    )
}

/**
 * [getAxisReferenceline 获取Axis坐标系的水平参考线]
 * @return {Object} [description]
 */
export function getAxisReferenceline(op) {
    let obj = {
        silent: true,
        lineStyle: {
            normal: {
                color: '#d2674d'
            }
        },
        data: [
            {yAxis: op.value, name: '分割提示线'}
        ]
    }
    return obj
}
