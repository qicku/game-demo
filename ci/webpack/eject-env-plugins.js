/*!
 * FilePath     : eject-env-plugins.js
 * 2019-12-15 14:55:49
 * Description  : Extension devtools v0.1.0
 *
 *
 * Copyright 2019-2021 Lamborui
 *
 */
const webpack = require('webpack')
const DotenvWebpack = require('dotenv-webpack')
const pkgJson = require('../../package.json')
const { getGitInfo } = require('./gitbash-helper')
const { Join } = require('../paths')

const envext = process.env.NODE_ENV || 'development'

// load env
const EnvHandler = {
  env: {},
  push: (key, value) => {
    !!value && (EnvHandler.env[key] = JSON.stringify(value))

    return EnvHandler
  },
  getEnv: () => EnvHandler.env,
  getOriginEnv: () => {
    let envObj = {}
    for (let i in EnvHandler.env) {
      envObj[i] = JSON.parse(EnvHandler.env[i])
    }

    return envObj
  },
}

EnvHandler.push(
  '__IS_DEBUG_MODE__',
  process.env['NODE_ENV'] === 'development' ? true : false
)
  .push('__WORKBENCH__', 'BRAVE_EXTENSION_DEV_PLATFORM')
  .push(
    '__APP_AUTHOR__',
    process.env['APP_AUTHOR'] || pkgJson.author || 'QuickDevGroup'
  )
  .push('__APP_VERSION__', pkgJson.version || '2.0.0')
  .push('__COMMIT_HASH__', getGitInfo().commitHash)

module.exports.EjectEnv = EnvHandler.getOriginEnv()

const dotEnvPlugin = new DotenvWebpack({
  path: Join('./config/', `.env.${envext}`),
  safe: false,
  allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
  systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
  defaults: Join('./config/', '.env'),
})

/** Support env use in build script */
module.exports.currDotEnvs = dotEnvPlugin.getEnvs().env

/**
 * Env conifg at config/.env.{enviroment config name}
 */
module.exports.EjectPlugins = [
  dotEnvPlugin,
  // This load dynamic env
  new webpack.DefinePlugin({ ...EnvHandler.env }),
]
