/**
 * 检查op里是否有指定属性 没有返回一个默认键值
 * @param op
 * @param checkName
 * @returns {}
 */
function propsCheck(op, checkName) {
    let obj = Object.create(null);
    if (op === undefined) {
        obj[checkName] = {}
        op = obj;
    }
    if (!op[checkName]) {
        obj[checkName] = {}
    } else {
        obj = op;
    }
    return obj;
}

/**
 * 获取属性
 * @param op 属性对象
 * @param modal 模块名
 * @param key  属性名
 * @returns {*}
 */
function getProps(op, modal, key) {
    let mark = (prop, m, k) => {
        let opt = propsCheck(prop, m)
        let v = opt[m][k] !== undefined ? opt[m][k] : ''
        return v
    }
    if (Array.isArray(key)) {
        let obj = {}
        for (let k of key) {
            obj[k] = mark(op, modal, k)
        }
        return obj
    }
    let v = mark(op, modal, key)
    return v

}

/**
 * 获取Special属性
 * @param op
 * @param key 属性名
 */
export function getSpecialProps(op, key) {
    let prop = getProps(op, 'specialProps', key)
    return prop
}

/**
 * AXIS
 * @param op
 * @param key 属性名
 */
export function getAxisProps(op, key) {
    let prop = getProps(op, 'axisProps', key)
    return prop
}

/**
 * 获取通用属性
 * @param op
 * @param key 属性名
 */
export function getCommonProps(op, key) {
    let prop = getProps(op, 'commonProp', key)
    return prop
}

/**
 * 获得图例属性
 * @param prop
 * @param {Array} keys
 */
export function getLegendProps(prop, keys) {
    let k = 'commonProp'
    return getProps(prop, k, keys);
}

/**
 * 获得地图属性
 * @param props
 * @param keys
 * @returns {*}
 */
export function getMapProps(props, keys) {
    let k = 'mapOption'
    return getProps(props, k, keys);
}

/**
 * getCompSpecialProps 获得组件特殊属性中的某个子类型的属性
 * @param  {Object} props 属性大对象
 * @param  {String} compkey 特殊属性中的二级类型 例如 bar line map等
 * @param  {Array|String} keys 支持字符串或者数组 取里面的键值 例如取 bar里面的['width','hoverColor'] 或者 'width'
 * @return {Object|String}  数组返回对象键值 字符串返回值
 */
export function getCompSpecialProps(props, compkey, keys) {
    let k = 'specialProp'
    let attr = props[k];
    return getProps(attr, compkey, keys);
}

/**
 * getSeriesObjPropsTransform  转换每个图表的默认属性 到 series基础对象
 * @param  {String} chartType  图表类型 bar ,line ,pie
 * @param  {Object} props     属性大对象
 * @return {[type]}
 */
export function getSeriesObjPropsTransform(chartType, props) {
    let seriesObj = {
        type: chartType
    }

    let chartTypeArr = {
        'bar': ['hoverColor', 'width', 'isStack'],
        'line': ['isStack', 'isArea', 'symbol', 'symbolSize', 'smooth'],
        'pie': ['isRing', 'innerRadius', 'outerRadius', 'isLabelLine', 'roseType', 'proportion', 'isLabel', 'centerX', 'centerY']
    }

    let tmpObj = {}
    // 折线图统一处理
    if (chartType === 'line') {
        let lineAttr = getCompSpecialProps(props, chartType, chartTypeArr[chartType]);
        let smooth = true
        switch (lineAttr.smooth) {
            case '1':
                smooth = true
                break;
            case '0':
                smooth = false
                break
            default:
                smooth = true
        }
        tmpObj = {
            type: chartType,
            stack: null,
            smooth: smooth,
            symbol: lineAttr.symbol,
            symbolSize: lineAttr.symbolSize
        }
        if (lineAttr.isArea === '1') {
            tmpObj.areaStyle = {
                normal: {
                    opacity: 0.5
                }
            }
        } else if (lineAttr.isArea === '0') {
            tmpObj.areaStyle = {
                normal: {
                    opacity: 0
                }
            }
        }
        if (lineAttr.isStack === '1') {
            tmpObj.stack = '总量'
        }
        // 饼图统一处理
    } else if (chartType === 'pie') {
        let pieAttr = getCompSpecialProps(props, chartType, chartTypeArr[chartType]);
        let radius = []

        if (pieAttr.isRing === '1') {
            if (pieAttr.innerRadius && pieAttr.outerRadius && pieAttr.innerRadius !== pieAttr.outerRadius) {
                radius = [pieAttr.innerRadius + '%', pieAttr.outerRadius + '%']
            } else {
                radius = ['50%', '70%']
            }
        } else {
            radius = '50%'
        }

        // 处理label显示
        let lableShow = pieAttr.isLabel === '1' || pieAttr.isLabel === '';

        // 处理中心点
        let center = ['50%', '40%']
        if (pieAttr.centerX && pieAttr.centerX !== '') {
            center[0] = pieAttr.centerX + '%'
        }
        if (pieAttr.centerY && pieAttr.centerY !== '') {
            center[1] = pieAttr.centerY + '%'
        }

        tmpObj = {
            radius: radius,
            center: center,
            roseType: pieAttr.roseType === '1' ? 'area' : false,
            label: {
                normal: {
                    show: lableShow
                },
                emphasis: {
                    show: lableShow
                }
            },
            labelLine: {
                normal: {
                    show: pieAttr.isLabelLine === '1'
                }
            }
        }
        // 柱形图
    } else if (chartType === 'bar') {
        let barAttr = getCompSpecialProps(props, chartType, chartTypeArr[chartType]);
        tmpObj = {
            stack: barAttr.isStack === '1' ? '总量' : null,
            itemStyle: {
                emphasis: {
                    color: barAttr.hoverColor
                }
            },
            animationDelay: function(idx) {
                return idx * 20;
            }
        }
        if (barAttr.width > 0 && barAttr.width !== '') {
            tmpObj.barWidth = barAttr.width;
        } else {
            tmpObj.barWidth = '';
        }

    }

    seriesObj = _.merge(seriesObj, tmpObj);
    return seriesObj;

}
