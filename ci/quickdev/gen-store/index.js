/*!
 * FilePath     : index.js
 * 2021-12-22 14:38:20
 * Description  : Extension devtools v0.1.0
 * 		 Generate store module files
 *
 * Copyright 2019-2021 Lamborui
 *
 */
const path = require('path')
const fs = require('fs-extra')

const {
  getModMainName,
  getMainNameNoState,
  pickAcitonFileName,
  getDefaultUpdatePropTypeKey,
  getDefaultUpdateStateActionName,
  pickTypeValt,
  buildCommentTpl,
  buildActionsCommentTpl,
} = require('../helpers/store-helper')
const { FILE_OUTPUT_OPTS } = require('../helpers/quick-helper')

module.exports.generateStoreModule = generateStoreModule

function generateStoreModule(argv = {}) {
  const { modStore, stateName, settings = {} } = argv
  const { modStoreBasePath } = settings

  const actionFileName = pickAcitonFileName(modStore, stateName)
  const indexFileName = 'index'
  const updStateAcitonMethodName = getDefaultUpdateStateActionName(
    modStore,
    stateName
  )
  const reducerModName = `reduce${getMainNameNoState(
    modStore,
    stateName,
    true
  )}`
  const modMainName = getModMainName(modStore, stateName)
  const updStateTypeKey = getDefaultUpdatePropTypeKey(modStore, stateName)
  const updStateTypeValt = pickTypeValt(modStore, stateName)

  let opts = {
    ...settings,
    actionFileName,
    updStateAcitonMethodName,
    modMainName,
    reducerModName,
    updStateTypeKey,
    updStateTypeValt,
  }

  const files = [`${indexFileName}.js`, `${actionFileName}.js`]
  const modIndexFilePath = path.resolve(modStoreBasePath, `${indexFileName}.js`)
  const modActionFilePath = path.resolve(
    modStoreBasePath,
    `${actionFileName}.js`
  )

  writeModStoreIndex(modIndexFilePath, opts)
  writeActionFile(modActionFilePath, opts)

  return buildSuccessText(files, modStoreBasePath, modMainName)
}

function buildSuccessText(files = [], modStoreBasePath, modMainName) {
  let text = `\x1b[32m✨✨✨✨✨✨\x1b[0m\n\x1b[32m QuickDev Tools generate \x1b[0m\x1b[1;31m${modMainName}\x1b[0m\x1b[1;32m store successful.\n✨✨✨✨✨✨\x1b[0m\n`
  text +=
    `\x1b[36m\tThere are generate follow files at:\n\t${modStoreBasePath}\x1b[0m\n` +
    `\x1b[32m ${files.map((t) => '\t' + t).join('\n')}\x1b[0m\n`

  return text
}

function writeModStoreIndex(filepath, options = {}) {
  const { actionFileName, updStateTypeKey, modMainName, reducerModName } =
    options

  const commentsTpl = buildCommentTpl(modMainName, options)

  const impTpl = `import { ${updStateTypeKey} } from './${actionFileName}'\n`

  const usageTpl = `\n// you should add ${modMainName} into root store file,usally at src/store/reducers.js\n`

  let codeTpl = ''
  codeTpl +=
    `export default function ${reducerModName}(state = {}, { type, val }) {\n` +
    `  const ${modMainName} = {\n` +
    `    // xxx: '',\n` +
    `    ...state,\n` +
    `  }\n`

  // switch
  codeTpl +=
    '\n' +
    `  switch (type) {\n` +
    `    case ${updStateTypeKey}: \n` +
    `      return { ...${modMainName}, ...val }\n` +
    `    default: \n` +
    `      return ${modMainName}\n` +
    `  }\n`

  // close code
  codeTpl += '}\n'

  const data = commentsTpl + impTpl + usageTpl + codeTpl

  fs.outputFileSync(filepath, data, FILE_OUTPUT_OPTS)
}

function writeActionFile(filepath, options = {}) {
  const {
    updStateTypeKey,
    updStateTypeValt,
    updStateAcitonMethodName,
    modMainName,
  } = options

  const commentsTpl = buildActionsCommentTpl(options)

  let typeKeysTpl =
    '// Action types defined here or defined in global file: store/core-action-types.js\n'
  typeKeysTpl += `export const ${updStateTypeKey} = '${updStateTypeValt}'\n`

  let defaultActionTpl = '\n// This action generate by QuickDev Tools\n'

  defaultActionTpl +=
    `export const ${updStateAcitonMethodName} = (${modMainName}) => ({\n` +
    `  type: ${updStateTypeKey},\n` +
    `  val: ${modMainName} || {},\n` +
    `})\n`

  const data = commentsTpl + typeKeysTpl + defaultActionTpl
  fs.outputFileSync(filepath, data, FILE_OUTPUT_OPTS)
}
