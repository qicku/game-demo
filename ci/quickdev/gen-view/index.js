/*!
 * FilePath     : index.js
 * 2021-12-19 21:34:18
 * Description  : Extension devtools v0.1.0
 * 		 This file is implement
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

module.exports.generateViewModule = generateViewModule

function generateViewModule(argv = {}) {
  const {
    modBase,
    fullPath = false,
    unstyled = false,
    modName,
    settings = {},
  } = argv

  if (!modBase || !modBase.trim()) throw new Error('ModBase required.')
  const {
    modParentPath,
    modPath,
    modCompFileName,
    modContainerFileName,
    modIndexFileName,
    sassFileName,
  } = settings

  const modIndexFilePath = path.resolve(modPath, `${modIndexFileName}.js`)
  const modCompFilePath = path.resolve(modPath, `${modCompFileName}.jsx`)
  const modContainerFilePath = path.resolve(
    modPath,
    `${modContainerFileName}.js`
  )

  if (
    fs.existsSync(modIndexFilePath) ||
    fs.existsSync(modCompFilePath) ||
    fs.existsSync(modContainerFilePath)
  ) {
    throw new Error(`Module ${modBase} had been exists in ${modParentPath}`)
  }

  // make sure dir
  fs.ensureDirSync(modPath)
  const successFiles = [
    `${modIndexFileName}.js`,
    `${modCompFileName}.jsx`,
    `${modContainerFileName}.js`,
  ]

  // write Index.js
  writeIndexFile(modIndexFilePath, { ...settings, modBase, unstyled })

  writeModuleCompFile(modCompFilePath, { ...settings, modBase, unstyled })

  writeModuleContainerFile(modContainerFilePath, {
    ...settings,
    modBase,
    unstyled,
  })

  if (!unstyled) {
    const styleFilePath = path.resolve(modPath, `${sassFileName}.scss`)
    writeStyleFile(styleFilePath, { ...settings, modBase, unstyled })
    successFiles.push(`${sassFileName}.scss`)
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
 * @param {*} param1
 */
function writeIndexFile(filepath, options = {}) {
  const { modBase, modContainerFileName } = options
  const commentsTpl = buildModuleIndexComments(options)

  const codeTpl = `export { default } from './${modContainerFileName}.js'\n`

  fs.outputFileSync(filepath, commentsTpl + codeTpl, FILE_OUTPUT_OPTS)
}

/**
 *
 * @param {*} filepath
 * @param {*} options
 */
function writeModuleContainerFile(filepath, options = {}) {
  const { modBase, modCompFileName, compName } = options

  let impHeadTpl = ''

  impHeadTpl +=
    `import { compose } from 'redux'\n` +
    `import { connect } from 'react-redux'\n` +
    `// import { withRouter } from 'react-router-dom'\n` // react-router v6 eprecated

  impHeadTpl += '\n' + `import ${compName} from './${modCompFileName}'\n`

  let statePropsTpl = '\n'
  statePropsTpl +=
    `/**\n` +
    ` * \n` +
    ` * @module\t: ${modBase}\n` +
    ` * \t make state inject into react dom ... ed.\n` +
    ' *\n' +
    ' */\n'

  statePropsTpl +=
    'const mapStateToProps = (state) => {\n' +
    `  // global state contains skinState ... ed.\n` +
    `  const {\n` +
    `    skinState: { isDarkTheme }\n` +
    `  } = state\n` +
    '\n' +
    `  return {\n` +
    `    isDarkTheme,\n` +
    `  }\n}\n`

  let mapDispatchTpl = '\n'

  mapDispatchTpl +=
    `const mapDispatchToProps = (dispatch) => {\n` +
    `  return {\n` +
    `    // doSomeThing: (arg1,arg2) => (dispatch) => {\n` +
    `    //  ...\n` +
    `    //  dispatch(action)\n` +
    `    // },\n` +
    `  }\n` +
    `}\n`

  let expTpl = '\n'
  expTpl +=
    `export default compose(\n` +
    `  // withRouter,\n` + // router v6 deprecated
    `  connect(mapStateToProps, mapDispatchToProps)\n` +
    `)(${compName})\n`

  const data = impHeadTpl + statePropsTpl + mapDispatchTpl + expTpl

  fs.outputFileSync(filepath, data, FILE_OUTPUT_OPTS)
}

/**
 *
 * @param {*} filepath
 * @param {*} options
 */
function writeModuleCompFile(filepath, options = {}) {
  const {
    modBase,
    compName,
    modStylePrefix = '',
    i18nextEnabled = false,
  } = options

  let impHeadTpl = `/*! This module ${modBase} DOM Root **/\n`
  impHeadTpl += `import React, { Component } from 'react'\n`

  i18nextEnabled &&
    (impHeadTpl += `import { withTranslation } from 'react-i18next'\n`)

  let codeTpl = '\n'
  codeTpl +=
    `class ${compName} extends Component {\n` +
    `\n` +
    `  constructor(props) {\n` +
    `    super(props)\n` +
    `    this.state = {\n` +
    `      // a: true, // Page cache state defined here.\n` +
    `    }\n` +
    `  }\n`

  codeTpl +=
    '\n' +
    `  componentDidMount() {\n    //here regist some eventlistener or handle init.\n  }\n`

  codeTpl +=
    '\n' +
    `  componentWillUnmount() {\n    //here unregist some eventlistener or handle destory.\n  }\n`

  // header
  if (modStylePrefix) {
    codeTpl +=
      '\n' +
      `  renderHeader(){\n` +
      `    return <div className='${modStylePrefix}__header'>${compName} Header </div>\n` +
      `  }\n`

    codeTpl +=
      '\n' +
      `  renderContent(){\n` +
      `    return <div className='${modStylePrefix}__content'>${compName} Content </div>\n` +
      `  }\n`

    codeTpl +=
      '\n' +
      `  renderFooter(){\n` +
      `    return <div className='${modStylePrefix}__footer'>${compName} Footer </div>\n` +
      `  }\n`

    codeTpl += '\n' + `  render() {\n`

    i18nextEnabled
      ? (codeTpl +=
          `    // const {t,isDarkTheme} = this.props\n` +
          `    // translation use: t('key',options)\n`)
      : (codeTpl += `    // const {isDarkTheme} = this.props\n`)

    codeTpl +=
      `\n` +
      `    return (\n` +
      `      <div className='${modStylePrefix}-page'>\n` +
      `        {this.renderHeader()}\n` +
      `        {this.renderContent()}\n` +
      `        {this.renderFooter()}\n` +
      `     </div>\n` +
      `   )\n` +
      `  }\n`
  } else {
    codeTpl +=
      '\n' +
      `  renderHeader(){\n` +
      `    return <div>${compName} Header </div>\n` +
      `  }\n`

    codeTpl +=
      '\n' +
      `  renderContent(){\n` +
      `    return <div>${compName} Content </div>\n` +
      `  }\n`

    codeTpl +=
      '\n' +
      `  renderFooter(){\n` +
      `    return <div>${compName} Footer </div>\n` +
      `  }\n`

    codeTpl +=
      '\n' + `  render() {\n` + `    // const {isDarkTheme} = this.props\n`

    codeTpl +=
      `\n` +
      `    return (\n` +
      `      <div>\n` +
      `        {this.renderHeader()}\n` +
      `        {this.renderContent()}\n` +
      `        {this.renderFooter()}\n` +
      `     </div>\n` +
      `   )\n` +
      `  }\n`
  }

  // close class body
  codeTpl += '\n}\n'

  // export
  i18nextEnabled
    ? (codeTpl += `\nexport default withTranslation()(${compName})\n`)
    : (codeTpl += `\nexport default ${compName}\n`)

  fs.outputFileSync(filepath, impHeadTpl + codeTpl, FILE_OUTPUT_OPTS)
}

function writeStyleFile(filepath, options = {}) {
  const {
    modBase,
    modStylePrefix = '',
    unstyled,
    sassFileName,
    createDateTime,
  } = options

  let commnetsTpl = '/**\n'
  commnetsTpl +=
    ` * This style file generate by QuickDev Tools ${createDateTime}\n` +
    ` * This file used define the module ${modBase} styles.\n` +
    ` * This file must be imported into parent scss file, to take it effect.\n` +
    ` * like : @import './${modBase}/${sassFileName}.scss';\n` +
    ` */\n`

  let cssTpl = '\n'

  cssTpl +=
    `.${modStylePrefix} {\n` + `  &-page {\n` + `    margin: 0;\n` + `  }\n`

  // header
  cssTpl += '\n' + `  &__header {\n` + `    text-align: center;\n` + `  }\n`

  // content
  cssTpl +=
    '\n' +
    `  &__content {\n` +
    `    display: flex;\n` +
    `    flex-flow: column nowrap;\n` +
    `    flex: 1 1 auto;\n` +
    `  }\n`

  // footer
  cssTpl += '\n' + `  &__footer {\n` + `    text-align: center;\n` + `  }\n`

  cssTpl += `}\n`

  fs.outputFileSync(filepath, commnetsTpl + cssTpl, FILE_OUTPUT_OPTS)
}
