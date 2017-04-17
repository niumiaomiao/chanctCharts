/**
 * Created by yelingfeng on 2016/8/16.
 */

import {getAxisProps} from '../util/propsUtil'

/**
 *  处理折线图hover数据 存到全局变量
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
function handlerHoverGData(params) {
    let d = '';
    let compType;
    if (Array.isArray(params)) {
        d = params[0].data;
        compType = params[0].componentSubType
    } else {
        d = params.data;
        compType = params.componentSubType
    }

    if (compType === 'line') {
        let lineData = {};
        if (_.isObject(d)) {
            lineData = {value: d.value, name: d.name, data: {dataObj: d.dataObj}}
            if (d.xAxis) {
                lineData.xAxis = true;
            }
        } else {
            lineData = {value: d, name: params.name, data: {dataObj: {}}}
        }
        window['line_global_key'] = lineData;
    }
}

/**
 * callBackTooltip tooltip回调
 * @param  {[type]} params  [description]
 * @param  {[type]} trigger [description]
 * @param  {[type]} ylUnit  [description]
 * @return {[type]}         [description]
 */
function callBackTooltip(params, trigger, unitObj, props) {
    let content = '';
    // 横轴类型
    if (trigger === 'axis') {
        if (params.length === 1 && params[0].data.group === 'noGroup') {
            let da = params[0].data.dataObj;
            if (da.info) {
                content = da.info
            } else {
                content = da.name + '：' + da.value
            }
            handlerHoverGData(params)
        } else {
            content = params[0].name + '<br/>';
            let nv = _.chain(params).sortBy(o => {
                return parseFloat(o.value, 10);
            }).reverse().value();
            let fArr = []
            nv.forEach(item => {
                if (item.data && item.data.dataObj && item.data.dataObj.yIndex) {
                    if (item.data.dataObj.yIndex === "1") {
                        fArr.push(item)
                    } else if (item.data.dataObj.yIndex === "0") {
                        fArr.unshift(item)
                    }
                }
            })
            if (fArr && fArr.length !== 0) {
                nv = fArr
            }
            _.forEach(nv, it => {
                if (it.data) {
                    if (it.data.dataObj && it.data.dataObj.info) {
                        content += it.data.dataObj.info;
                    } else {
                        let name = it.seriesName;
                        let val
                        if (it.data === undefined) {
                            val = ''
                        } else {
                            if (it.data.value === undefined) {
                                val = 0
                            } else {
                                val = it.data.value
                            }
                        }
                        if (/\-/.test(it.seriesName)) name = it.name;
                        if (it.seriesIndex === 1 && unitObj.yrUnit) {
                            content += name + '：' + val + unitObj.yrUnit + '<br/>';
                        } else {
                            content += name + '：' + val + unitObj.ylUnit + '<br/>';
                        }
                    }
                }
            })
            handlerHoverGData(params)
        }
    } else {
        if (params.data) {
            let dataObj = params.data.dataObj ? params.data.dataObj : params.data;
            if (dataObj) {
                content = dataObj.info ? dataObj.info : '';
            }
            if (params.seriesType === 'pie') {
                if (dataObj.info && dataObj.info.match('%%PERCENT%%')) {
                    let replace
                    replace = params['percent']
                    content = dataObj.info.replace('%%PERCENT%%', replace || '0')
                }
                if (dataObj.percent !== undefined && dataObj.info === undefined) {
                    content = dataObj.name + '：' + dataObj.value + '：' + dataObj.percent + '%';
                }
            }
        }
        if (content === undefined || content === '') {
            if (isNaN(params.value)) {
                content = params.name
            } else {
                content = params.name + '：' + params.value;
            }
        }
        handlerHoverGData(params)
    }
    return content
}

// tip 通用格式
export function getTooltip(config, props) {
    let ylUnit = getAxisProps(props, 'ylUnit');
    let yrUnit = getAxisProps(props, 'yrUnit');
    let trigger = config && config.trigger || 'item';
    let tipObj = {
        trigger: trigger,
        textStyle: {
            fontSize: 12,
            align: 'left'
        },
        axisPointer: {
            type: 'shadow',
            lineStyle: {
                color: '#555555'
            }
        },
        backgroundColor: 'rgba(1,75,117,0.5)',
        padding: 9,
        formatter: function(params) {
            return `<div style="position: relative;" class="df-tooltip__box">
              <span  class="df-tooltip__span df-tooltip__row1 " ></span>
              <span  class="df-tooltip__span df-tooltip__row2 " ></span>
              <span  class="df-tooltip__span df-tooltip__col1 " ></span>
              <span  class="df-tooltip__span df-tooltip__col2 " ></span>
              ${callBackTooltip(params, trigger, {ylUnit, yrUnit}, props)}
              </div>`
        }
    }
    return tipObj;
}
