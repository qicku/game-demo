/*!
 * FilePath     : index.js
 * 2021-12-21 21:14:44
 * Description  : Extension devtools v0.1.0
 * 		 Refactor QuickDev For extension
 *
 * Copyright 2019-2021 Lamborui
 *
 */
const fs = require('fs-extra')
const path = require('path')

const {
  FILE_OUTPUT_OPTS,
  buildModuleIndexComments,
} = require('../helpers/quick-helper')

module.exports.generateFuncModule = generateFuncModule

/**
 *
 * @param {*} argv
 */
function generateFuncModule(argv = {}) {
  const { modBase, unstyled = false, settings = {} } = argv
  if (!modBase || !modBase.trim()) throw new Error('ModBase required.')
  const {
    modParentPath,
    modPath,
    modCompFileName,
    modIndexFileName,
    sassFileName,
  } = settings

  const modIndexFilePath = path.resolve(modPath, `${modIndexFileName}.js`)
  const modCompFilePath = path.resolve(modPath, `${modCompFileName}.jsx`)

  if (fs.existsSync(modIndexFilePath) || fs.existsSync(modCompFilePath)) {
    throw new Error(`Module ${modBase} had been exists in ${modParentPath}`)
  }

  const successFiles = [`${modIndexFileName}.js`, `${modCompFileName}.jsx`]
  writeFuncIndexFile(modIndexFilePath, { ...settings, modBase, unstyled })

  writeFuncCompFile(modCompFilePath, { ...settings, modBase, unstyled })

  if (!unstyled) {
    const styleFilePath = path.resolve(modPath, `${sassFileName}.scss`)

    successFiles.push(`${sassFileName}.scss`)
    writeFuncStyleFile(styleFilePath, { ...settings, modBase, unstyled })
  }

  return buildSuccessText(successFiles, modParentPath, modBase)
}

function buildSuccessText(files = [], modParentPath, modBase) {
  let text = `\x1b[32m✨✨✨✨✨✨\x1b[0m\n\x1b[32m QuickDev Tools generate ${modBase} successful.\n✨✨✨✨✨✨\x1b[0m\n`
  text +=
    `\x1b[36m\t There are generate follow files at:\n\t ${modParentPath}\x1b[0m\n` +
    `\x1b[32m ${files.map((t) => '\t' + t).join('\n')}\x1b[0m\n`

  return text
}

/**
 *
 * @param {*} filepath
 * @param {*} options
 */
function writeFuncIndexFile(filepath, options = {}) {
  const { compName, modCompFileName } = options

  const commentsTpl = buildModuleIndexComments(options, true)

  let codeTpl = '\n'
  codeTpl += `export { default as ${compName} } from './${modCompFileName}'\n`

  const data = commentsTpl + codeTpl

  fs.outputFileSync(filepath, data, FILE_OUTPUT_OPTS)
}

/**
 *
 * @param {*} filepath
 * @param {*} options
 */
function writeFuncCompFile(filepath, options = {}) {
  const {
    modBase,
    compName,
    unstyled = false,
    modStylePrefix,
    i18nextEnabled = false,
  } = options

  const commentsTpl = `/*! This module ${modBase} DOM Container, Generate by QuickDev Tools. **/\n`

  let impTpl = '\n'

  impTpl +=
    `import React, { useEffect, useState } from 'react'\n` +
    `import { useDispatch, useSelector } from 'react-redux'\n`

  i18nextEnabled &&
    (impTpl += `import { useTranslation } from 'react-i18next'\n`)

  let codeTpl = '\n'
  codeTpl +=
    `export default function ${compName}(props) {\n` +
    `  // const dispatch = useDispatch()\n`

  i18nextEnabled &&
    (codeTpl +=
      '\n' +
      `  // example translation: t('key',option[optional]) \n` +
      `  const { t, i18n } = useTranslation()\n`)

  codeTpl +=
    `\n` +
    `  // const [loading, setLoading] = useState(false)\n` +
    `\n` +
    `  // const { isDarkTheme } = useSelector((state) => state.skinState)\n`

  // useEffect
  codeTpl +=
    `  useEffect(() => {\n` +
    `    // here regist dom event listener or handle initialization.` +
    `\n` +
    `    return () => {\n` +
    `      // here unregist dom event listener or handle destory.\n` +
    `    }\n` +
    `  }, [])\n`

  // handler example
  codeTpl +=
    '\n' +
    `  // this a demo event handler \n` +
    `  const demoEvtHandler = async () => {}\n`

  if (!unstyled) {
    codeTpl +=
      '\n' +
      `  return (\n` +
      `    <div className='${modStylePrefix}-container'>\n` +
      `      <span onClick={ demoEvtHandler }>${compName} container content</span>\n` +
      `    </div>\n` +
      `  )\n`
  } else {
    codeTpl +=
      '\n' +
      `  return (\n` +
      `    <div>\n` +
      `      <span onClick={ demoEvtHandler }>${compName} container content</span>\n` +
      `    </div>\n` +
      `  )\n`
  }

  codeTpl += '}\n'

  const data = commentsTpl + impTpl + codeTpl

  fs.outputFileSync(filepath, data, FILE_OUTPUT_OPTS)
}

/**
 *
 * @param {*} filepath
 * @param {*} options
 */
function writeFuncStyleFile(filepath, options = {}) {
  const { modBase, compName, sassFileName, modStylePrefix, createDateTime } =
    options
  let commnetsTpl = '/**\n'
  commnetsTpl +=
    ` * This style file generate by QuickDev Tools ${createDateTime}\n` +
    ` * This file used define the module ${modBase} styles.\n` +
    ` * This file must be imported into parent scss file, to take it effect.\n` +
    ` * like : @import './${modBase}/${sassFileName}.scss';\n` +
    ` */\n`

  let cssTpl = '\n'
  cssTpl +=
    `.${modStylePrefix} {\n` +
    `  &-container {\n` +
    `    flex: 1 1 auto;\n` +
    `  }\n` +
    `}\n`

  const data = commnetsTpl + cssTpl
  fs.outputFileSync(filepath, data, FILE_OUTPUT_OPTS)
}
