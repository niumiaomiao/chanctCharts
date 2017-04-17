/**
 * Created by 14465 on 2017/3/14.
 */

import {axisMaxmin} from '../props/axisHelper'
import * as commonConfig from '../config/commonConfig'
import * as config from '../config/mapConfig'

// 获取visualMap的类型
export function visualMapType(props) {
    let type
    if (props.specialProp.map.mapType === '1') {
        type = 'piecewise'
    } else {
        type = 'continuous'
    }
    return type
}
// visualMap设置
export function getVisualMap(data, props) {
    let maxMin = axisMaxmin(data, props, 1)
    const visualConfig = {
        type: visualMapType(props),
        color: config.visualBlock,
        min: maxMin.min,
        max: maxMin.max,
        textStyle: {
            color: config.visualRangeColor
        }
    }
    if (visualConfig.type === 'piecewise') {
        visualConfig.itemWidth = commonConfig.legendIconWidth
        visualConfig.itemHeight = commonConfig.legendIconHeight
        if (maxMin.max < 1) {
            visualConfig.pieces = [
                {min: 0.80, max: 1.00},
                {min: 0.60, max: 0.80},
                {min: 0.40, max: 0.60},
                {min: 0.20, max: 0.40},
                {min: 0.00, max: 0.20}
            ];
            visualConfig.precision = 2
        }
    } else {
        visualConfig.realtime = false
        visualConfig.calculable = true
        if (maxMin.max < 1) {
            visualConfig.precision = 2
        }
        visualConfig.inRange = {
            color: config.visualInRange
        }
    }

    return visualConfig
}
