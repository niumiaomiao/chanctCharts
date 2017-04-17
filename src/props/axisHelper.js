/**
 * Created by yelingfeng on 2016/8/16.
 */

import * as config from '../config/commonConfig'
import {getAxisProps} from '../util/propsUtil'

/**
 * 获取label样式
 * @param op
 * @returns {{textStyle: {color: string, fontFamily: string}}}
 */
export function getAxisLabel(op, type) {
    if (!type || type === '') {
        type = 'xAxis'
    }
    let valueDisplay = getAxisProps(op, 'axisDisplay')
    let lableColor = ''
    if (op) {
        lableColor = op.axisProps.axisColor
    }
    let obj = {
        textStyle: {
            color: lableColor || config.axisLabelColor,
            fontFamily: config.commonFontFamily,
            fontSize: 12
        },
        interval: 'auto',
        formatter: function(value) {
            if (_.isNumber(value)) {
                if (valueDisplay === 0) {
                    return value
                } else if (valueDisplay === 1) {
                    return parseInt(value, 10)
                }
                return Math.abs(value).toFixed(0)

            }
            return value
        }
    };
    let rotate, angle;
    if (type === 'xAxis') {
        rotate = getAxisProps(op, 'axisNameModel')
        angle = getAxisProps(op, 'angle')
    } else {
        rotate = getAxisProps(op, 'yAxisNameModel')
        angle = getAxisProps(op, 'yAngle')
    }

    let interval = getAxisProps(op, 'interval')
    if (rotate === '1') {
        obj.rotate = 0
    } else if (rotate === '2') {
        obj.rotate = angle
    }

    if (interval !== '') {
        obj.interval = interval
    } else {
        obj.interval = 'auto'
    }

    return obj
}

export function getAxisLine(op) {
    let lineStyle = getAxisProps(op, 'axisColor')
    return {
        lineStyle: {
            color: lineStyle || 'rgba(0,0,0,0)',
            width: 1
        }
    }
}

export function getSplitLine() {
    return {
        show: false,
        lineStyle: {
            color: config.yAxisSplitColor,
            width: 2,
            type: 'solid'
        }
    }
}

export function getAxisName(props, name, unit) {
    return getAxisProps(props, name) + getAxisProps(props, unit);
}

const getMaxMin = data => {
    let arr = [];
    let max;
    let min;
    if (data && data.length) {
        data.forEach(it => {
            if (it.value) {
                arr.push(parseFloat(it.value));
            } else if (it) {
                arr.push(parseFloat(it));
            }
        });
    }

    if (arr.length > 0) {
        max = _.max(arr);
        min = _.min(arr);
    } else {
        max = 100;
        min = 0;
    }
    if (arr.length === 1 && arr[0] <= 100) {
        max = 100;
        min = 0;
    }

    max = max === 0 ? 100 : max;
    if (min === max) {
        max -= 0;
        max = Math.round(max + min * 0.5);
        min = Math.ceil(min * 0.5)
    }
    if (min >= 0) {
        min = 0
    }
    if (max > 10 && max <= 100) {
        max = _.ceil(max, -1)
    } else if (max > 100 && max <= 1000) {
        max = _.ceil(max, -2)
    } else if (max < 1000) {
        max = _.ceil(max, -3)
    } else if (max <= 1) {
        max = _.ceil(max, 1)
    } else if (max > 1 && max <= 10) {
        max = _.ceil(max)
    }
    return {
        max,
        min
    }
}

const getMaxMinByDb = series => {
    let lData = []
    let rData = []
    if (series instanceof Array) {
        series.forEach(item => {
            if (item.yAxisIndex === 1) {
                rData = rData.concat(item.data)
            } else {
                lData = lData.concat(item.data)
            }
        })
    }
    let lmaxmin = getMaxMin(lData);
    let rmaxmin = getMaxMin(rData);
    return {
        lmax: lmaxmin.max,
        lmin: lmaxmin.min,
        rmax: rmaxmin.max,
        rmin: rmaxmin.min
    }
}

/**
 * 计算最大最小值问题
 * @param {Array}  data  数据
 * @param {Object} props 属性对象
 * @param {String} _type  1: 数据自适应 , 2: 固定值
 * @param param {max , min }
 */
export function axisMaxmin(data, props, _type, dbObj) {
    let type = _type || getAxisProps(props, 'maxminType')
    let getylMax = getAxisProps(props, 'ylMax')
    let getylMin = getAxisProps(props, 'ylMin')
    let getyrMax = getAxisProps(props, 'yrMax')
    let getyrMin = getAxisProps(props, 'yrMin')
    let maxmin = {
        max: 100,
        min: 0
    };

    if (type === '1') {
        if (dbObj['isAxis']) {
            if (!dbObj['isDbYAxis']) {
                maxmin.max = null;
                maxmin.min = null;
                maxmin.ylmax = null;
                maxmin.ylmin = null;
            } else {
                maxmin = {
                    lmax: null,
                    lmin: null,
                    rmax: null,
                    rmin: null
                }
            }
        } else {
            if (!dbObj['isDbYAxis']) {
                let {max, min} = getMaxMin(data);
                maxmin.max = max;
                maxmin.min = min;
                maxmin.ylmax = max;
                maxmin.ylmin = min;
            } else {
                maxmin = {
                    lmax: 100,
                    lmin: 0,
                    rmax: 100,
                    rmin: 0
                }
                let {lmax, lmin, rmax, rmin} = getMaxMinByDb(data)
                maxmin.lmax = lmax
                maxmin.lmin = lmin
                maxmin.rmax = rmax
                maxmin.rmin = rmin
            }
        }


    } else if (type === '2') {
        if (props.axisProps.axisType === '1') {
            maxmin = {
                ylmax: getylMax,
                ylmin: getylMin
            }
        } else if (props.axisProps.axisType === '2') {
            maxmin = {
                ylmax: getylMax,
                ylmin: getylMin,
                yrmax: getyrMax,
                yrmin: getyrMin
            }
        }

    }
    return maxmin;
}

// 对象clone
function objClone(sourceObj) {
    return _.cloneDeep(sourceObj)
}

// 改变横纵坐标顺序
export function changeAxis(option) {
    let axisX = []
    axisX[0] = objClone(option.xAxis[0])
    let axisY = []
    axisY[0] = objClone(option.yAxis[0])
    axisX[0].axisLabel = option.yAxis[0].axisLabel
    axisX[0].name = option.yAxis[0].name
    axisY[0].axisLabel = option.xAxis[0].axisLabel
    axisY[0].name = option.xAxis[0].name
    option.yAxis = axisX
    option.xAxis = axisY
    return option
}

// 根据需求将折线图的坐标轴颜色进行改动
export function changeLabelLineByZLD(option, sub) {
    option.yAxis.forEach(item => {
        item.axisLine = {
            lineStyle: {
                color: 'rgba(2,87,144,0.5)'
            }
        }
        item.axisTick = false
    })
    if (sub !== 'lineUpDown' && sub !== 'lineUpDown2') {
        option.xAxis.forEach(item => {
            item.axisLine = {
                lineStyle: {
                    color: 'rgba(2,87,144,0.5)'
                }
            }
            item.axisTick = false
        })
    }
    return option
}

export function dbYAxisMaxMin(option, props) {
    let lr = axisMaxmin(option.series, props, 0, {isDbYAxis: true})
    if (option.yAxis instanceof Array) {
        option.yAxis.forEach((item, index) => {
            if (index === 1) {
                item.max = lr.rmax
                item.min = lr.rmin
            } else {
                item.max = lr.lmax
                item.min = lr.lmin
            }
        })
    }
    return option
}
