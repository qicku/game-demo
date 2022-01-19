/*!
 * FilePath     : quick-validation.js
 * 2021-12-20 15:22:29
 * Description  : Extension devtools v0.1.0
 * 		 Refactor QuickDev For extension
 *
 * Copyright 2019-2021 Lamborui
 *
 */

const path = require('path')
const fs = require('fs-extra')
const { capitalize } = require('lodash')

const { currentDateTime, currentDate } = require('./date-helper')
const { buildErrorLog } = require('./logger-builder')
const { quickRules = {} } = require('../qk-setting')

const MOD_PATH_REGEX = /^[a-zA-Z]+([a-zA-Z0-9]*([\-\/]?)(?!\2))*[a-zA-Z0-9]+$/
const MOD_NAME_REGEX = /^[a-zA-Z]+([a-zA-Z0-9]*([\-]?)(?!\2))*[a-zA-Z0-9]+$/

/**
 *
 * @param {*} argv
 * @param {*} options
 * @returns true /false
 */
module.exports.optionsValidate = function (argv = {}, options) {
  const {
    modBase,
    modName,
    fullPath = false,
    extModule = '',
    settings = {},
  } = argv

  const isViewCmd = ['gv', 'gen-view', 'add-view'].includes(argv['_'][0])

  const {
    addonMode = false,
    defaultViewBase,
    defaultPagesRoot,
    allPages = [],
  } = settings
  const _basePath = process.cwd()
  let transOptions = {
    srcPath: path.resolve(_basePath, 'src'),
    modIndexFileName: 'index',
  }

  if (!modBase || modBase === '.') {
    throw new Error(
      buildErrorLog(
        'modBase must a module path string',
        'Options [-m,--mod-base,--base] : '
      )
    )
  }
  if (!validateModBase(modBase)) {
    throw new Error(
      buildErrorLog(
        'modBase path required startsWith [a-z] character, like h123/n456',
        'Options [-m,--mod-base,--base] : '
      )
    )
  }

  if (addonMode && !fullPath && (!extModule || !allPages.includes(extModule))) {
    throw new Error(
      `extModule required one of ${allPages.join(',')} At addonMode`
    )
  }

  let modParentPath = addonMode
    ? path.resolve(
        _basePath,
        'src',
        defaultPagesRoot,
        extModule,
        defaultViewBase
      )
    : path.resolve(_basePath, 'src', defaultViewBase)

  if (fullPath) {
    modParentPath = path.resolve(_basePath, 'src')
  }

  let modPath = path.resolve(modParentPath, modBase)

  if (modName && !validModName(modName)) {
    throw new Error(
      buildErrorLog(
        'modName required a string only contains [a-zA-Z0-9-] character',
        'Options [-n,--mod-name,--name] : '
      )
    )
  }

  const modCompFileName = buildModCompFileName(modBase)
  const modContainerFileName = buildModContainerFileName(modBase)
  const modStylePrefix = pickStylePrefix(modBase, modName)
  const compName = buildModCompName(modBase, modName, isViewCmd)

  const sassFileName = pickStyleFileName(modBase)

  // check
  if (
    fs.existsSync(
      path.resolve(modPath, `${transOptions.modIndexFileName}.js`)
    ) ||
    fs.existsSync(path.resolve(modPath, `${modCompFileName}.jsx`))
  ) {
    throw new Error(
      buildErrorLog(
        `Had exists some files [${modCompFileName}.jsx or ${transOptions.modIndexFileName}.js] under ${modPath}`,
        'Options [-n,--mod-base,--name] : '
      )
    )
  }

  const createDateTime = currentDateTime()
  const createDate = currentDate()
  transOptions = {
    ...transOptions,
    isViewCmd,
    modPath,
    modParentPath,
    modCompFileName,
    modContainerFileName,
    modStylePrefix,
    sassFileName,
    compName,
    createDateTime,
    createDate,
  }

  argv.settings = { ...settings, ...transOptions }
  // console.log('Debug>>>>>>>', argv)
  return true
}

function validModName(modName) {
  return new RegExp(MOD_NAME_REGEX).test(modName)
}
/**
 *
 * @param {*} modBase
 * @returns
 */
function validateModBase(modBase) {
  if (!modBase) return false
  return new RegExp(MOD_PATH_REGEX).test(modBase)
}

function buildModCompFileName(modBase) {
  return `${pickupModFilePrefixName(modBase)}-comp`
}

function buildModContainerFileName(modBase) {
  return `${pickupModFilePrefixName(modBase)}-container`
}

/**
 *
 * @param {*} modBase
 * @returns
 */
function pickStyleFileName(modBase) {
  const { RESERVED_KEYWORDS_4MODSUFFIX = [] } = quickRules
  const _oriparts = modBaseParts(modBase)

  let _parts = _oriparts.filter(
    (t) => !RESERVED_KEYWORDS_4MODSUFFIX.includes(t.toLowerCase())
  )

  let fileName = _parts.length ? _parts[0] : _oriparts[0]
  //
  if (_parts.length > 1) {
    // aa/bb/cc-sds pick bb
    fileName = _parts.slice(-1)[0]
  } else if (_parts.length) {
    fileName = _parts[0]
  }

  return fileName
}

function pickStylePrefix(modBase, modName) {
  let prefix = ''
  const { RESERVED_KEYWORDS_4SASSPREFIX = [] } = quickRules
  if (modName) {
    let _nparts = modName
      .replace(/([A-Z])/g, '_$1')
      .split(/-|_/)
      .filter((t) => !RESERVED_KEYWORDS_4SASSPREFIX.includes(t.toLowerCase()))
    if (_nparts.length) return _nparts[0].toLowerCase()
  }

  const _mparts = modBaseParts(modBase)

  let _filterparts = _mparts.filter(
    (t) => !RESERVED_KEYWORDS_4SASSPREFIX.includes(t)
  )

  prefix =
    _filterparts.length >= 2
      ? _filterparts[1]
      : _filterparts.length
      ? _filterparts[0]
      : ''

  if (!prefix) {
    prefix = _nparts.length > 2 ? _nparts[1] : _nparts.length ? _nparts[0] : ''
  }
  return prefix
}

/**
 * build module component file name jsx
 * @param {*} modBase
 * @param {*} modName
 */
function pickupModFilePrefixName(modBase) {
  const { RESERVED_KEYWORDS_4MODSUFFIX = [] } = quickRules
  const _oriparts = modBaseParts(modBase)

  let _parts = _oriparts.filter(
    (t) => !RESERVED_KEYWORDS_4MODSUFFIX.includes(t.toLowerCase())
  )

  let fileName = _parts.length ? _parts[0] : _oriparts[0]
  if (_parts.length > 1) {
    fileName = _parts.slice(-1)[0]
  } else if (_parts.length) {
    fileName = _parts[0]
  }

  return fileName
}

/**
 * If modName
 * @param {string} modBase
 * @param {string} modName
 */
function buildModCompName(modBase, modName, isViewCmd = false) {
  const { RESERVED_KEYWORDS_4NAME = [] } = quickRules

  if (modName) {
    const _modName = modName.replace(/([A-Z])/g, '_$1')
    let _nparts = _modName.split(/-|_/).map((t) => capitalize(t.toLowerCase()))

    return _nparts.join('')
  }

  const _oriparts = modBaseParts(modBase)

  let _last = ''
  for (let i = _oriparts.length - 1; i >= 0; i--) {
    if (!RESERVED_KEYWORDS_4NAME.includes(_oriparts[i])) {
      _last = _oriparts[i]
      break
    }
  }

  _last = _oriparts.length ? _oriparts.slice(-1)[0] : ''

  if (_last) {
    let _lastParts = _last.split(/-/).map((t) => capitalize(t.toLowerCase()))
    if (isViewCmd) _lastParts = _lastParts.concat(['Page'])
    return _lastParts.join('')
  }

  return 'MainComp'
}

/**
 * home/index => index
 * @param {*} modBase
 * @returns
 */
function pickLastPath(modBase) {
  const _parts = modBase
    .split(/\/|\\/)
    .filter((p) => !!p && p.toLowerCase() !== 'index')

  const len = _parts.length
  return len > 0 ? _parts[_parts.length - 1] : ''
}
/**
 * toLowerCase
 * @param {*} modbase
 * @returns
 */
function modBaseParts(modbase = '') {
  return modbase
    .split(/\/|\\/)
    .filter((t) => !!t)
    .map((t) => t && t.toLowerCase())
}
