/*!
 * FilePath     : webpack.dev.js
 * 2019-18-15 09:05:43
 * Description  : Extension devtools v0.1.0
 * 		 This file is implement
 *
 * Copyright 2019-2021 Lamborui
 *
 */
// make sure this code at top
const NODE_ENV_VALT = 'development'
process.env.BABEL_ENV = NODE_ENV_VALT
process.env.NODE_ENV = NODE_ENV_VALT

const { merge } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const commomConfig = require('./webpack.base')

module.exports = merge(commomConfig, {
  mode: NODE_ENV_VALT,
  devtool: 'cheap-module-source-map', // 'cheap-module-source-map',
  plugins: [new ReactRefreshWebpackPlugin()],
})
