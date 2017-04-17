/**
 * Created by yelingfeng on 2016/8/25.
 */

import {getLegendProps} from '../util/propsUtil'
import * as config from '../config/commonConfig'
const RC = {
    PROP_TITLE_ALIGN: {
        TOPLEFT: '1',
        TOPCENTER: '2',
        TOPRIGHT: '3',
        BOTTOMCENTER: '4'
    }
}

/**
 * 图例设置
 * @param data
 * @param props
 * @returns {*}
 */
export function getLegend(data, props) {
    let legend = {};
    let lp = getLegendProps(props, ['isLegend', 'legendPosition']);
    let isLength = false;
    switch (lp.isLegend) {
        case '0':
            isLength = false
            break;
        case '1':
            isLength = true
            break;
        default:
            isLength = false
    }
    legend.show = isLength
    switch (lp.legendPosition) {
        case RC.PROP_TITLE_ALIGN.TOPLEFT:
            legend.left = 'left'
            legend.top = 'top'
            break;
        case RC.PROP_TITLE_ALIGN.TOPCENTER:
            legend.left = 'center'
            legend.top = 'top'
            break;
        case RC.PROP_TITLE_ALIGN.TOPRIGHT:
            legend.left = 'right'
            legend.top = 'top'
            break;
        case RC.PROP_TITLE_ALIGN.BOTTOMCENTER:
            legend.left = 'center'
            legend.top = 'bottom'
            break;
        default :
            legend.left = 'center'
            legend.top = 'top'
    }
    legend.textStyle = {
        color: config.legendColor,
        fontFamily: config.commonFontFamily
    }
    legend.itemWidth = config.legendIconWidth
    legend.itemHeight = config.legendIconHeight
    legend.itemGap = 6
    if (data && data.length) {
        legend.data = data;
    }
    return legend;
}
