import * as config from '../config/commonConfig'
import {
    getTooltip,
    getAxisLabel,
    getAxisLine,
    getAxisName,
    axisMaxmin,
    getLegend,
    getSplitLine,
    getGirdOption,
    getLinearGradient,
    getAxisReferenceline
} from '../props'
import {
  getCompSpecialProps,
  getSeriesObjPropsTransform
} from '../util/propsUtil'

const XAXIS = config.xAxis;
const axisLabelColor = config.axisLabelColor;

/**
 * 图表基类
 */
export default class ChartClass {
    constructor(op) {
        this.option = op
        this.init()
    }

    init() {
        let me = this
        if (this.option.el === undefined) {
            throw new Error('el not found. 请配置dom')
        }
        this.EC = echarts.init(this.option.el)
        this.EC.on('click', (...arg) => {
            me.specialChartClick(...arg)
        })
        this.EC.getZr().on('click', () => {
           // 判断tooltip显示时候再触发
            let $tipBox = $('.df-tooltip__box');
            if ($tipBox.is(':hidden')) return;
            if (/line/.test(this.__chartName__)) {
                me.option.onClick()
            }
        })
    }

    hideTip() {
        this.EC.dispatchAction({
            type: 'hideTip'
        })
    }

    specialChartClick(...arg) {
        let me = this
        if (me.option.sub === 'windrose') {
            me.option.onClick = parmer => {
                if (parmer && parmer.data && parmer.seriesName !== 'bottom') {
                    let targetNum = parmer.data.dataObj.ordernum

                    me.option.data.forEach(it => {
                        if (it.ordernum === targetNum) {
                            it.isActive = true;
                        } else {
                            it.isActive = false;
                        }
                    })

                    me.ECOption.series.forEach(seriesObj => {
                        if (seriesObj.name === 'active') {
                            seriesObj.data.forEach(item => {
                                if (item.dataObj.ordernum === targetNum) {
                                    item['itemStyle'] = {
                                        normal: {
                                            color: '#d8ad22'
                                        },
                                        emphasis: {
                                            color: '#f3d266'
                                        }
                                    }
                                } else {
                                    item['itemStyle'] = {
                                        normal: {
                                            color: 'rgba(0,0,0,0)',
                                            labelLine: {
                                                show: false
                                            },
                                            label: {
                                                show: false
                                            }
                                        },
                                        emphasis: {
                                            show: false
                                        }
                                    }
                                }
                            })
                        }
                    })
                    this.updateOption(me.ECOption)
                }
            }
        }
        me.option.onClick(...arg)
    }

    build(option) {
        if (this.EC) {
            this.ECOption = option
            this.updateOption(option)
        }
    }

    updateOption(option) {
        option = this.fixBarShadowColor(option)
        this.EC.clear()
        this.EC.setOption(option)
    }

    /**
     * [fixBarShadowColor 处理柱图 柱图少的时候 阴影效果不好的问题]
     * 当前数据小于N个的时候 激活
     * @param  {Object} op 处理后的数据
     * @return 返回处理后的op
     */
    fixBarShadowColor(op) {
        let num = 4;
        let barWidth = this.option.props.specialProp.bar.width ;
        barWidth = barWidth ? parseFloat(barWidth) : '';
        let isFix = false;
        if (op.series.length) {
            op.series.forEach(item => {
                if (item.type === 'bar' && item.data.length < num) {
                    isFix = true;
                }
            })
        }
        // true 特殊处理 把tooltip修改下触发方式
        if (isFix) {
            op.tooltip.axisPointer = {
                type: 'line',
                lineStyle: {
                    color: 'rgba(150,150,150,0.3)',
                    width: barWidth + barWidth * 2
                }
            }
        }
        return op;
    }
    resize() {
        if (this.EC) {
            this.EC.resize()
        }
    }
    setMapJson(e) {
    }
    render(data) {
        if (this.EC) {
            this.EC.clear()
            this.option.data = data
            // let props = this.option.props || {}
            if (data == null || data.length === 1 && data[0].name === '' || data.length === 0) {
                let emptyOp = this.emptyBuild();
                if (emptyOp) {
                    if (this.__chartName__ === 'map') {
                        this.setMapJson(this.option.sub)
                    }
                    this.build(emptyOp)
                }
            } else {
                this.create()
            }
        }
    }

    // 空数据构建
    emptyBuild() {
        return this[this.__chartName__ + 'EmptyBuild']()
    }
    updateProp(props) {
        this.option.props = props;
        this.create()
    }
    dispose() {
        if (this.EC) {
            this.EC.dispose();
        }
    }

    /**
     * 注册模块名称
     * @param module 一级模块
     * @param subModule 二级模块
     */
    registerModule(module, subModule) {
        this.__chartName__ = module
        this.subModuleName = subModule
    }
    /**
     * 检查模块
     */
    checkModule() {
        const sub = this.option.sub;
        if (!this.subModuleName[sub]) {
            throw new Error(`the sub module is undefined ,
                 cur module has [${Object.keys(this.subModuleName).join(',')}]
                 无效的二级模块名称,请使用当前已经定义的模块 [${Object.keys(this.subModuleName).join(',')}]`)
        }
        if (this.option.data == null) {
            throw new Error('data is null ,看看你的data 为啥是空的');
        }
    }

    /**
     * 非分组集合遍历
     */
    noGroupData() {
        let categories = []
        let datas = []
        let specialProps = this.option.props.specialProp;
        if (this.option.data) {
            this.option.data.forEach(item => {
                categories.push(item.name || '')
                datas.push({
                    name: item.name,
                    value: item.value || 0,
                    info: item.info,
                    dataObj: item,
                    group: 'noGroup'
                })
            })
        }
        var seriesObj = getSeriesObjPropsTransform(this.__chartName__, this.option.props);
        seriesObj.data = datas ;
        if (this.__chartName__ === 'bar' && specialProps || this.__chartName__ === 'line' && specialProps) {
            let op = parseInt(this.option.props.axisProps.referenceLineValue, 10)
            seriesObj.markLine = getAxisReferenceline({value: op})
        }
        return {
            category: categories,
            series: seriesObj
        }
    }

    /**
     * 分组data 处理方法
     * @param data
     * @returns {{category: Array, xAxis: Array, series: Array}}
     */
    groupData() {
        let me = this;
        let stack = false;
        let specialProps = this.option.props.specialProp;
        let markLine = false
            // 用来后面添加竖线进行类型上的判断
        if (me.__chartName__ === 'bar' && specialProps || me.__chartName__ === 'line' && specialProps) {
            // 是否堆积
            switch (specialProps[me.__chartName__].isStack || specialProps[me.__chartName__].isArea) {
                case '0':
                    stack = false
                    break;
                case '1':
                    stack = true
                    break;
                default:
                    stack = false
            }
            markLine = true
        }
        let data = this.option.data || [];
        let xAxis = [];
        let group = [];
        let series = [];
        let hasXAsix
        let emptyData = {
            category: [],
            xAxis: [],
            series: []
        };
        let chainsData = _.chain(data);

        if (data == null || data.length === 1 && data[0].name === '') {
            return emptyData;
        }
        // 取分组
        group = chainsData.filter(it => {
            return it.category !== '' && it.category != null && it.category !== XAXIS;
        })
            .map(it => {
                return it.category;
            })
            .uniq()
            .value();
        let legend = [];

        group.forEach(it => {
            if (it === 'xAxis') {
                // 与后台约定，如果有xAxis  x轴data就取xAxis的集合
                hasXAsix = true
            } else {
                legend.push({
                    name: it
                })
            }
        })

        if (hasXAsix) {
            // 过滤掉xAxis
            group = chainsData
                .filter(function(it) {
                    return it.category !== '' && it.category != null && it.category !== 'xAxis' ;
                })
                .map(function(it) {
                    return it.category;
                })
                .uniq()
                .value();
        }
        // 去横轴坐标名
        if (hasXAsix) {
            xAxis = chainsData.filter(function(data) {
                return data.category === 'xAxis';
            }) .map(function(it) {
                return it.name;
            }).value();
        } else {
            xAxis = chainsData.map(it => {
                return it.name;
            }).uniq().value();
        }
        // 当有xAxis的时候，处理数据的方法
        function lookGroupValue(groupName, xAxis) {
            let val = chainsData.filter(function(it) {
                return it.name === xAxis && it.category != null && it.category === groupName
            }).map(function(data) {
                return data.value;
            }).toString().value();

            return val;
        }

        // 拼装series
        group.forEach(g => {
            let seriesTemp = [];
            if (hasXAsix) {
                xAxis.forEach(x => {
                    let val = lookGroupValue(g, x);
                    let obj = g;
                    data.forEach(item => {
                        if (item.category === g && item.name === x) {
                            obj = item
                        }
                    })
                    seriesTemp.push({name: x, value: val === '' ? 0 : val, dataObj: obj, xAxis: true});
                });
            } else {
                data.forEach(d => {
                    if (d.category === g) {
                        seriesTemp.push({
                            name: d.name,
                            value: d.value,
                            dataObj: d,
                            tooltip: {
                                formatter: d.info
                            },
                            group: 'group'
                        })
                    }
                })
            }
            let seriesOjb = getSeriesObjPropsTransform(this.__chartName__, this.option.props);
            seriesOjb.name = g;
            seriesOjb.data = seriesTemp;
            series.push(seriesOjb)
        })

        // 在这里对markLine进行判断。看是否图形为柱状图或者折线图
        if (markLine && this.option.props.axisProps && series.length > 0) {
            let op = parseInt(this.option.props.axisProps.referenceLineValue, 10)
            if (op) {
                let nullObj = _.cloneDeep(series[0])
                nullObj.name = 'sLine'
                nullObj.type = 'line'
                nullObj.data = []
                nullObj['lineStyle'] = {
                    normal: {
                        color: 'rgba(0,0,0,0)'
                    }
                }
                series.push(nullObj)
            }
            series[0].markLine = getAxisReferenceline({value: op})
            legend.push({
                name: 'sLine',
                icon: 'image://./src/assets/images/stopIcon.svg',
                textStyle: {
                    color: '#ccc'
                }
            })
        }
        return {
            category: legend,
            xAxis: xAxis,
            series: series,
            data: data
        };
    }

    /**
     * 单图表通用设置 用于单图 饼图 等
     * @param seriesObj
     * @param props
     */
    singleChartSetting(seriesObj, props) {
        let legend = getLegend(seriesObj.category, props);
        let colorList = config.commonColorList;
        let nameColor = props.axisProps.axisColor
        let specialProps = this.option.props.specialProp;
        if (specialProps && specialProps[this.__chartName__].colorList) {
            colorList = specialProps[this.__chartName__].colorList
        }
        let option = {
            color: colorList,
            legend: legend,
            series: [seriesObj.series]
        }

        if (/line|bar/.test(this.__chartName__)) {
            let maxMin = axisMaxmin(seriesObj.series.data, props, 1)
            let tooltips = getTooltip({
                trigger: 'axis'
            }, props)
            let splitLine = getSplitLine()
            let grid = getGirdOption(props);
            let xName = getAxisName(props, 'xName', 'xUnit')
            let yName = getAxisName(props, 'ylName', 'ylUnit')
            option.tooltip = tooltips;
            option.grid = grid
            option.xAxis = [{
                name: xName,
                type: 'category',
                nameTextStyle: {
                    color: nameColor
                },
                data: seriesObj.category,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: getAxisLabel(props, 'xAxis'),
                splitLine: false,
                axisLine: false,
                boundaryGap: ['0%', '5%']
            }];
            option.yAxis = [{
                max: maxMin.ylmax,
                min: maxMin.ylmin,
                name: yName,
                nameTextStyle: {
                    color: nameColor
                },
                type: 'value',
                axisLabel: getAxisLabel(props, 'yAxis'),
                splitLine: splitLine,
                axisLine: false,
                boundaryGap: ['0%', '5%']
            }];
        }
        if (/pie|map/.test(this.__chartName__)) {
            let tooltips = getTooltip({
                trigger: 'item'
            }, props)
            option.tooltip = tooltips;

            if (this.__chartName__ === 'pie' && option.legend) {
                option.legend.orient = 'vertical' ;
            }
        }
        option.textStyle = {
            fontFamily: config.commonFontFamily,
            fontSize: config.commonFontSize
        }
        return option
    }

    /**
     *  坐标系图表通用处理
     *  整合柱图和折线图 通用配置 包括属性 多分组 堆积等
     *
     * @param seriesObj groupData处理后的数据
     * @param props  属性对象
     * @returns {{color: string[], tooltip: *, grid: *, xAxis: *[], yAxis: *[], series: *}}
     */
    axisChartSetting(seriesObj, props) {
        let tooltips = getTooltip({
            trigger: 'axis'
        }, props)
        let splitLine = getSplitLine()
        let legend = getLegend(seriesObj.category, props);
        let grid = getGirdOption(props);
        let xName = getAxisName(props, 'xName', 'xUnit')
        let yName = getAxisName(props, 'ylName', 'ylUnit')
        let maxMin = axisMaxmin(seriesObj.data, props)
        let colorList = config.commonColorList
        let nameColor = props.axisProps.axisColor
        let specialProps = this.option.props.specialProp;
        if (specialProps && specialProps[this.__chartName__].colorList) {
            colorList = specialProps[this.__chartName__].colorList
        }
        let option = {
            legend: legend,
            color: colorList,
            tooltip: tooltips,
            grid: grid,
            xAxis: [{
                name: xName,
                type: 'category',
                nameTextStyle: {
                    color: nameColor
                },
                data: seriesObj.xAxis,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: getAxisLabel(props, 'xAxis'),
                splitLine: false,
                axisLine: false,
                boundaryGap: ['0%', '5%']
            }],
            yAxis: [{
                max: maxMin.ylmax,
                min: maxMin.ylmin,
                name: yName,
                nameTextStyle: {
                    color: nameColor
                },
                type: 'value',
                axisLabel: getAxisLabel(props, 'yAxis'),
                splitLine: splitLine,
                axisLine: false,
                boundaryGap: ['0%', '5%']
            }],
            series: seriesObj.series
        }
        option.textStyle = {
            fontFamily: config.commonFontFamily
        }
        return option
    }

    /**
     * 雷达图的处理类
     * @param {Object} seriesObj
     * @param {Object} props
     */
    getRadarSetting(seriesObj, props) {
        let tooltip = getTooltip({
            trigger: 'item'
        }, props)
        let grid = getGirdOption(props);
        let xAxis = seriesObj.xAxis;
        let radarData = _.chain(xAxis).map(it => {
            return {
                name: it
            }
        }).value();
        seriesObj.category.forEach(it => {
            it.icon = 'rect'
        })
        let legend = getLegend(seriesObj.category, props);
        let _series = [];
        seriesObj.series.forEach(it => {
            let v = [];
            let radarValue = [];
            let dataObj = {info: ''}
            // 雷达图tooltip 显示
            it.data.forEach(k => {
                v.push(k.value);
                if (k.dataObj.info) {
                    dataObj.info += k.dataObj.info;
                } else {
                    dataObj.info = dataObj.info + k.name + '：' + k.value + '<br/>';
                }
            })

            radarValue.push({
                name: it.name,
                value: v,
                dataObj: dataObj
            });

            _series.push({
                name: it.name,
                type: 'radar',
                data: radarValue,
                symbol: 'none',
                itemStyle: {
                    normal: {
                        color: '#00fcff'
                    },
                    emphasis: {
                        color: '#efb314'
                    }
                },
                areaStyle: {
                    normal: {
                        color: '#00fcff',
                        opacity: 0.2
                    },
                    emphasis: {
                        color: '#efb314',
                        opacity: 0.2
                    }
                },
                lineStyle: {
                    normal: {
                        width: 1,
                        opacity: 1,
                        color: '#00fcff'
                    },
                    emphasis: {
                        color: '#efb314'
                    }
                }
            });
        })

        let option = {
            legend,
            tooltip,
            grid: grid,
            radar: {
                indicator: radarData,
                shape: '',
                splitNumber: '',
                radius: '45%',
                name: {
                    textStyle: {
                        color: '#a6f1ff'
                    }
                },
                center: ['50%', '48%'],
                splitLine: {
                    lineStyle: {
                        color: [
                            '#004863'
                        ]
                    }
                },
                splitArea: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#26425f'
                    }
                }
            },
            series: _series
        }
        return option;
    }
    /**
     * 热力图的处理类
     * @param {Object} seriesObj
     * @param {Object} props
     */
    getHeatMapSetting(seriesObj, props) {
        let legend = getLegend(seriesObj.category, props);
        let tooltip = getTooltip({
            trigger: 'item'
        }, props);
        let grid = getGirdOption(props);
        let yAxis = _.chain(seriesObj.category)
            .map(function(chr) {
                return chr.name
            }).value();
        let xAxis = seriesObj.xAxis;

        let series = seriesObj.series;

        series = _.flatten(_.chain(series)
            .map(function(chr, n) {
                return _.chain(chr.data)
                    .map(function(it, m) {
                        // return [n,m,parseInt(it.value)]
                        return {
                            name: it.name,
                            value: [m, n, parseInt(it.value, 10) || '-'],
                            dataObj: it.dataObj
                        }
                    }).value();
            }).value());

        let option = {
            legend,
            tooltip,
            animation: false,
            grid,
            xAxis: {
                type: 'category',
                data: xAxis,
                splitArea: {
                    show: true
                },
                axisTick: {
                    show: false
                },
                axisLabel: getAxisLabel(props, 'xAxis')
            },
            yAxis: {
                type: 'category',
                data: yAxis,
                splitArea: {
                    show: true
                },
                axisTick: {
                    show: false
                },
                axisLabel: getAxisLabel(props, 'yAxis')
            },
            series: [{
                name: 'Punch Card',
                type: 'heatmap',
                data: series,
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        return option;
    }
}
