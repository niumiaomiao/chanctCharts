/**
 * Created by ylf on 2017/4/17.
 */
import ChartClass from '../../common/chartClass'
import subComps from './sub'

// sub模块构建方法名
const _settingMethod_ = 'setting'
const subModuleName = {
    'base': 1,
    'level': 1,
    'group': 1,
    'updown': 1,
    'multiAxis': 1,
    'groupLevel': 1,
    'baseLevel': 1
}

/**
 * 柱形图封装类
 */
class Bar extends ChartClass {
    constructor(op) {
        super(op);
        this.registerModule('bar', subModuleName)
    }

    create() {
        this.checkModule();
        // 二级模块名
        const sub = this.option.sub
        // 属性
        const props = this.option.props || {};
        let config = [this.option.data];
        // 通用
        if (sub === 'base' || sub === 'baseLevel') {
            config[0] = this.singleChartSetting(this.noGroupData(), props)
        } else {
            config[0] = this.axisChartSetting(this.groupData(), props)
        }
        config[1] = props;
        config[2] = this.option.data
        let option = subComps[sub][_settingMethod_](...config)
        this.build(option);

    }

    // 空数据构建
    barEmptyBuild() {
        let value = 0
        return {
            yAxis: {
                axisLine: false,
                axisLabel: {
                    textStyle: {
                        color: '#00d8f1',
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 12
                    },
                    formatter: function() {
                        return value++
                    }
                },
                nameTextStyle: {
                    color: '#00d8f1'
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(0,228,255,0.1)',
                        type: 'solid',
                        width: 2
                    }
                },
                type: 'value'
            },
            xAxis: {
                data: ['无数据'],
                axisLabel: {
                    textStyle: {
                        color: '#00d8f1',
                        fontSize: 12
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                z: 10
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    return params[0].name
                }
            },
            series: [{
                type: 'bar',
                data: [0]
            }]
        }
    }

}

export {
    Bar
}
