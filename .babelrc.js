/*!
 * FilePath     : .babelrc.js
 * 2020-02-16 09:49:01
 * Description  : Extension devtools v0.1.0
 * 		 This file is implement
 *
 * Copyright 2019-2021 Lamborui
 *
 */
const presets = [
  [
    '@babel/preset-env',
    {
      modules: false,
      targets: {
        browsers: ['last 1 version', '> 5%', 'not dead'],
      },
      debug: false, //方便调试
    },
  ],
  [
    '@babel/preset-react',
    {
      runtime: 'automatic',
    },
  ],
  '@babel/preset-typescript',
]

/**
 * Plugin run before Presets
 * Plugins Sort: left --> right configuration
 */
const plugins = [
  [
    '@babel/plugin-transform-runtime',
    {
      corejs: {
        version: 3,
        proposals: true,
      },
      useESModules: true,
    },
  ],
]

module.exports = function (api) {
  api.cache(true)
  return {
    presets,
    plugins,
  }
}
