/*!
 * FilePath     : store-helper.js
 * 2021-12-22 15:46:29
 * Description  : Extension devtools v0.1.0
 * 		 This file is implement transform path to name
 *
 * Copyright 2019-2021 Lamborui
 *
 */
/**
 * Pick actions name from modStore or stateName
 */
const { capitalize } = require('lodash')

const pathRegexp = /\/|\\\\/

module.exports.pickAcitonFileName = pickAcitonFileName
function pickAcitonFileName(modStore, stateName) {
  let acts = []
  if (stateName) {
    const _tmp = stateName.replace(/([A-Z])/g, '-$1').toLowerCase()
    acts = _tmp.split(/-/)
    acts.slice(-1)[0] !== 'actions' && acts.push('actions')
    return acts.join('-')
  }

  acts = []
  const _modparts = modStore.split(pathRegexp)
  acts = _modparts.slice(-1)[0].split(/-/)
  acts.slice(-1)[0] !== 'actions' && acts.push('actions')

  return acts.join('-')
}

module.exports.getModMainName = getModMainName

module.exports.getDefaultUpdatePropTypeKey = function (modStore, stateName) {
  const mainName = getModMainName(modStore, stateName)
  // UI_STATE
  const mid = (mainName || '').replace(/([A-Z])/g, '_$1').toUpperCase()

  return mid ? `UPD_${mid}_BY_PROPS` : 'UPD_STATE_BY_PROPS'
}

module.exports.getDefaultUpdateStateActionName = function (
  modStore,
  stateName
) {
  // uiState
  const mainName = getModMainName(modStore, stateName)

  // UI_STATE
  const mid =
    mainName.length > 1
      ? mainName.slice(0, 1).toUpperCase() + mainName.slice(1)
      : mainName.toUpperCase()

  return `update${mid}ByProps`
}

function getModMainName(modStore, stateName) {
  // uiState,wallState,bizWorkState
  let modMainName = ''
  if (stateName) {
    modMainName = stateName.endsWith('State') ? stateName : `${stateName}State`
  } else {
    const _last = modStore.split(pathRegexp).slice(-1)[0]
    let _nparts = _last.split(/-/)
    _nparts.slice(-1)[0] !== 'state' && _nparts.push('state')
    modMainName = _nparts
      .map((n, idx) => (idx > 0 ? capitalize(n) : n))
      .join('')
  }
  if (!modMainName || !modMainName.length)
    throw new Error(`Parse mainName fail from :${modStore} and ${stateName}`)
  return modMainName
}

module.exports.getMainNameNoState = getMainNameNoState
function getMainNameNoState(modStore, stateName, firstUp = false) {
  let name = getModMainName(modStore, stateName)

  // remove State suffix
  name =
    name.lastIndexOf('State') > 0
      ? name.slice(0, name.lastIndexOf('State'))
      : name

  if (firstUp) {
    return name.length > 1
      ? name.slice(0, 1).toUpperCase() + name.slice(1)
      : name.toUpperCase()
  } else {
    return name.length > 1
      ? name.slice(0, 1).toLowerCase() + name.slice(1)
      : name.toLowerCase()
  }
}

module.exports.pickTypeValt = pickTypeValt
function pickTypeValt(modStore, stateName) {
  let modHead = ''
  let sub = ''
  const mainName = getModMainName(modStore, stateName)
  const nameParts = mainName
    .replace(/([A-Z])/g, '_$1')
    .split(/_/)
    .filter((t) => t.toLowerCase() !== 'state')

  if (nameParts.length > 1) {
    modHead = nameParts[0].toLowerCase()
  }
  const mparts = modStore.split(pathRegexp)
  if (mparts.length > 1 || !modHead) {
    modHead = mparts[0].toLowerCase()
  }

  if (nameParts.length > 1) {
    sub = nameParts[1].toLowerCase()
  } else if (nameParts.length && nameParts[0] !== modHead) {
    sub = nameParts[0].toLowerCase()
  }

  return !!sub
    ? `${modHead}@${sub}/update_state`
    : `${modHead}@props/update_state`
}

module.exports.buildCommentTpl = buildCommentTpl
function buildCommentTpl(mainName, options = {}) {
  const { author, email, commentsAuthorEnabled, license, createDateTime } =
    options
  let tpl = '/*!\n'
  tpl +=
    ' *\n' +
    ` * @module\t: ${mainName} generate by QuickDev Tools \n` +
    ` * @createDate\t: ${createDateTime}\n`

  if (commentsAuthorEnabled) {
    let authorStr = ''
    if (author && email) {
      authorStr = `${author}<${email}>`
    } else if (author || email) {
      author = author
    }

    authorStr && (tpl += ` * @auhtor\t: ${authorStr}\n`)
  }

  tpl +=
    ` * @description\t: \n` +
    ' *\n' +
    ` * @license ${license}\n` +
    ` * \n` +
    ' */\n'

  return tpl
}

module.exports.buildActionsCommentTpl = buildActionsCommentTpl
function buildActionsCommentTpl(options = {}) {
  const { author, email, commentsAuthorEnabled, license, createDateTime } =
    options
  let tpl = '/*!\n'
  tpl +=
    ' *\n' +
    ` * @module\t: Actions file generate by QuickDev Tools \n` +
    ` * @createDate\t: ${createDateTime}\n`

  if (commentsAuthorEnabled) {
    let authorStr = ''
    if (author && email) {
      authorStr = `${author}<${email}>`
    } else if (author || email) {
      author = author
    }

    authorStr && (tpl += ` * @auhtor\t: ${authorStr}\n`)
  }

  tpl +=
    ` * @description\t: \n` +
    ' *\n' +
    ` * @license ${license}\n` +
    ` * \n` +
    ' */\n'

  return tpl
}
