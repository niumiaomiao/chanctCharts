/**
 * Created by ylf on 2017/4/17.
 */
const buble = require('rollup-plugin-buble')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const lodash = require("lodash");
const echarts = require("echarts");
const version = process.env.VERSION || require('./package.json').version
const path = require('path')
const banner = `/**
 * ChanctChart v${version}
 * (c) chanct ${new Date().getFullYear()} yelingfeng
 * @license MIT
 */ `

module.exports = {
    entry: 'src/index.js',
    plugins: [
        // buble({
        //     transforms: {dangerousForOf: true}
        // }),
        buble({
            exclude: ['node_modules/**', '*.json'],
            transforms: { dangerousForOf: true }
        }),
        node(),
        cjs()
    ],
    external: ['echarts', 'lodash'],
    targets: [
        {
            dest: "dist/chanctChart.js",
            format: 'umd',
            moduleName: 'ChanctChart',
            sourceMap: true
        }
    ],
    banner: banner
}
