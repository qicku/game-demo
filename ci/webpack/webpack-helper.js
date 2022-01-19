/****************************
 * FilePath: webpack-helper.js
 * 2019-12-15 14:00:17
 * Description:
 *
 * Copyright 2019-2021 Lamborui, All Rights Reserved.
 *
 */
const HtmlWebpackPlugin = require('html-webpack-plugin')

const publicPath = process.env.ASSET_PATH || ''

const { R, src, LOGO, biz } = require('../paths')
const { AppTitle } = require('../../config')

const BasePageRoot = ''
const JsExtensions = ['js', 'jsx', 'ts', 'tsx']
const ImgExtensions = ['png', 'jpg', 'jepg', 'gif', 'svg']

const Entries = {
  index: R(src, 'index.js'),
  // background: R(src, BasePageRoot, 'background', 'index.js'),
  // popup: R(src, BasePageRoot, 'popup', 'index.js'),
  // options: R(src, BasePageRoot, 'options', 'index.js'),
  // e404: R(src, BasePageRoot, 'unfound', 'index.js'),
}

const ResolveAlias = {
  '~': src,
  '~Biz': biz,
  '~Asset': R(src, 'asset'),
  '~Lib': R(src, 'lib'),
  '~UI': R(src, 'ui'),
  '~Scss': R(src, 'ui/scss'),
  '~Store': R(src, 'store'),
  '~Widget': R(src, 'ui/widgets'),
  '~Mock': R(src, 'mocks'),
  '~Page': R(src, 'pages'),
  '~Views': R(src, 'views'),
  // '~P3View': R(src, 'popup/views'),
  // '~P3Store': R(src, 'popup/store'),
}

const IndexHtmWebpackPlugin = new HtmlWebpackPlugin({
  title: AppTitle || 'Quick DevTools',
  publicPath: publicPath,
  favicon: LOGO,
  template: R(src, 'html.ejs'),
  filename: 'index.html',
  chunks: ['index'],
  cache: false,
  // excludeChunks: ['background'],
})

const optHtmWebpackPlugin = new HtmlWebpackPlugin({
  title: AppTitle || 'Quick DevTools',
  publicPath: publicPath,
  favicon: LOGO,
  template: R(src, BasePageRoot, 'options', 'options.ejs'),
  filename: 'options.html',
  chunks: ['options'],
  cache: false,
  excludeChunks: ['background'],
})

const E404HtmWebpackPlugin = new HtmlWebpackPlugin({
  title: AppTitle || 'BasChain',
  publicPath: publicPath,
  favicon: LOGO,
  template: R(src, BasePageRoot, 'unfound', '404.ejs'),
  filename: '404.html',
  chunks: ['e404'],
  cache: false,
  excludeChunks: ['background'],
})

const htmlPlugins = [IndexHtmWebpackPlugin]

module.exports = {
  publicPath,
  BasePageRoot,
  Entries,
  htmlPlugins,
  ResolveAlias,
  ResolveExtensions: JsExtensions.concat(['css', 'scss', 'less'])
    .concat(ImgExtensions)
    .map((ext) => `.${ext}`),
  JsExtensions,
  ImgExtensions,
}
