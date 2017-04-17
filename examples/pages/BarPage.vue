<template>
    <div class="page-auxiliar">
        <div class="bar" ref="bar">

        </div>
    </div>
</template>
<script>
//    import {Bar} from "@/index"
    import { Bar } from "../../dist/chanctChart"
    export default {
        name: 'BarPage',
        data() {
            return {
                'barOp': {},
                'barData': [
                    {name: '制造页', value: 10, info: '12'},
                    {name: '金融', value: 20},
                    {name: '教育', value: 50},
                    {name: '个人', value: 60},
                    {name: '军队', value: 15},
                    {name: '事业单位', value: 120}
                ]
            }
        },
        mounted() {
            let me = this;
            let charts = new Bar({
                el: me.$refs.bar,
                sub: 'base',
                props: {
                    axisProps: {},
                    specialProp: {
                        'bar': {
                            colorList: []
                        }
                    }
                },
                onClick: function(...arg) {
                    me.clickHandler(...arg)
                }
            });
            charts.render(this.barData)
        },
        methods: {
            clickHandler(arg) {
                console.log(arg)
            }
        }
    };
</script>
<style>
    .bar {
        width: 600px;
        height: 400px;
    }
</style>
