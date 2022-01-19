/*!
 * FilePath     : global-store-options.js
 * 2021-12-22 11:07:28
 * Description  : Extension devtools v0.1.0
 * 		 This file is implement
 *
 * Copyright 2019-2021 Lamborui
 *
 */
const path = require('path')
const fs = require('fs-extra')
const { quickSettings } = require('../qk-setting')
const pkg = require('../package.json')
const {
  buildPurpleFont,
  buildHighlightFont,
  buildErrorLog,
  buildInfoLog,
} = require('./logger-builder')

const { pickAcitonFileName } = require('./store-helper')
const { currentDate, currentDateTime } = require('./date-helper')

const STORE_PATH_REGEX = /^[a-z]+([a-z0-9]*([\-\/]?)(?!\2))*[a-z0-9]+$/

module.exports.StoreOptionsWrap = function (yargs) {
  const { addonMode = false, allPages = [] } = quickSettings
  let _options = {
    'mod-store': {
      alias: ['m', 'p', 'path'],
      demandOption: true,
      describe: 'The store module subpath',
      type: 'string',
    },
    'state-name': {
      alias: ['n', 'name'],
      describe: 'State name',
      type: 'string',
    },
  }

  if (addonMode) {
    _options['ext-module'] = {
      alias: ['e'],
      demandOption: false,
      describe: `Extension page module`,
      type: 'string',
    }
  }
  const globalKeys = Object.keys(_options).concat(['help', 'version'])

  let cli = yargs
    .option('settings')
    .hide('settings')
    .config({
      settings: {
        ...quickSettings,
        createDate: currentDate(),
        createDateTime: currentDateTime(),
      },
    })
    .version(pkg.version || '1.0.0')
    .usage(buildPurpleFont('Usage: --mod-store [string]'))
    .options(_options)
    // .normalize('mod-store')
    .alias('help', 'h')
    .alias('version', 'v')
    .strictOptions(true)
    .fail((msg, err, yargs) => {
      console.log(buildErrorLog(msg || err))
      console.error(yargs.help())
      process.exit(1)
    })
    .group(globalKeys, buildHighlightFont('Global Options'))

  if (addonMode) {
    cli = cli.choices('ext-module', allPages)
  }

  return cli.check((argv, options) => argvChecker(argv, options))
}

function argvChecker(argv, options) {
  const { modStore, stateName } = argv

  validStorePath(modStore)
  validStateName(stateName)

  const modStoreBasePath = validModStoreExists(argv)
  argv.settings.modStoreBasePath = modStoreBasePath

  return true
}

function validStorePath(subpath) {
  const errMsg = buildErrorLog(
    `subpath string that can only contain lowercase letters,numbers and -. \n\tLike: ui/head-state`,
    'Required mod-store'
  )
  const regExp = new RegExp(STORE_PATH_REGEX)
  if (!regExp.test(subpath)) {
    throw new Error(errMsg)
  }

  let _parts = subpath.split(/\/|\\\\/)
  for (let i = 0; i < _parts.length; i++) {
    if (!regExp.test(_parts[i])) throw new Error(errMsg)
  }
}

function validStateName(stateName) {
  const nameRegexp = new RegExp(/^[a-z][a-zA-Z0-9]{2,}$/)
  const errMsg = buildErrorLog(
    `name required letters,numbers \n\tLike: uiState,wall0State`,
    'Optional state-name [-n,--name]'
  )
  if (stateName && !nameRegexp.test(stateName)) throw new Error(errMsg)
}

function validModStoreExists(argv) {
  const { modStore, stateName, extModule, settings = {} } = argv
  const {
    addonMode,
    defaultSoreRoot,
    defaultPagesRoot,
    allPages = [],
  } = settings
  const _basePath = process.cwd()

  if (extModule && !allPages.includes(extModule)) {
    throw new Error(
      buildErrorLog(
        `a string one of [${allPages.join(',')}]`,
        'Required ext-module'
      )
    )
  }

  const modStorePath = extModule
    ? path.resolve(
        _basePath,
        'src',
        defaultPagesRoot,
        extModule,
        defaultSoreRoot,
        modStore
      )
    : path.resolve(_basePath, 'src', defaultSoreRoot, modStore)

  const actionFilename = pickAcitonFileName(modStore, stateName)
  if (
    fs.existsSync(path.resolve(modStorePath, `index.js`)) ||
    fs.existsSync(path.resolve(modStorePath, `${actionFilename}.js`))
  ) {
    throw new Error(
      buildErrorLog(
        `${modStorePath} Already exists.`,
        `Check store ${modStore}`
      )
    )
  }

  return modStorePath
}
