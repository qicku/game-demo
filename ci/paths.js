/****************************
 * FilePath: paths.js
 * 2019-12-15 13:35:10
 * Description:
 * 		 This file Set the Project root folders
 * Copyright 2019 Lanbery, All Rights Reserved.
 *
 */

const path = require('path')

const bsTarget = process.env.BS_TARGET || 'chrome'
module.exports = {
  IsAbsolute: (p) => path.isAbsolute(p),
  Join: (...p) => path.join(...p),
  R: (...p) => path.resolve(...p),
  BaseResolve: (...p) => path.resolve(__dirname, '..', ...p),
  src: path.resolve(__dirname, '../src'),
  dist: path.resolve(__dirname, '../dist'),
  distZip: path.resolve(__dirname, '../dist-zip'),
  distTarget: path.resolve(__dirname, '../dist', bsTarget),
  // srcRules: path.resolve(__dirname, '../src/req-rules'),
  confDir: path.resolve(__dirname, '../config'),
  pubDir: path.resolve(__dirname, '../public'),
  LOGO: path.resolve(__dirname, './faster.png'),
  biz: path.resolve(__dirname, '../src', 'biz'),
}
