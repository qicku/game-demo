/*!
 * FilePath     : global-options.js
 * 2021-12-20 11:29:38
 * Description  : Extension devtools v0.1.0
 * 		 This file is implement
 *
 * Copyright 2019-2021 Lamborui
 *
 */
const chalk = require('chalk')
const { quickSettings } = require('../qk-setting')
const { optionsValidate } = require('./quick-validation')
const { buildHighlightFont, buildPurpleFont } = require('./logger-builder')

const pkg = require('../package.json')
module.exports.CommonOptionsWrap = function (yargs) {
  let commonOptions = {
    'mod-base': {
      alias: ['m', 'base'],
      demandOption: true,
      describe: 'The module base path',
      type: 'string',
    },
    'mod-name': {
      alias: ['n', 'name'],
      describe: 'The module main file name',
      type: 'string',
    },
    'full-path': {
      alias: ['f', 'force'],
      default: false,
      describe: 'Set base under the project src or absolute path',
      type: 'boolean',
    },
    unstyled: {
      alias: ['u', 'no-sass'],
      default: false,
      describe: 'Do not generate style files',
      type: 'boolean',
    },
  }

  if (quickSettings.addonMode) {
    commonOptions['ext-module'] = {
      alias: ['e'],
      describe: 'The Extension Page Module',
      type: 'string',
    }
  }

  const globalKeys = Object.keys(commonOptions).concat(['help', 'version'])
  let cli = yargs
    .option('settings')
    .hide('settings')
    .config({ settings: quickSettings })
    .version(pkg.version || quickSettings.version)
    .usage(
      buildPurpleFont(
        'Usage: <cmd> --mod-base [string] -mod-name [string] --full-path [boolean] --no-sass [boolean]'
      )
    )
    .options(commonOptions)
    .check((argv, options) => {
      return optionsValidate(argv, options)
    })
    .demandOption(
      'mod-base',
      chalk.redBright('Please entry a module path string')
    )
    // .normalize('mod-base')
    .alias('help', 'h')
    .alias('version', 'v')
    .strictOptions(true)
    .fail((msg, err, yargs) => {
      console.log(msg || err)
      console.error(yargs.help())
      process.exit(1)
    })
    .group(globalKeys, buildHighlightFont('Global Options'))

  return quickSettings.addonMode
    ? cli.choices('ext-module', quickSettings.allPages || ['popup'])
    : cli
}
