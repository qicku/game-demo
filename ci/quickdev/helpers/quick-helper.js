/*!
 * FilePath     : quick-helper.js
 * 2021-12-21 14:22:39
 * Description  : Extension devtools v0.1.0
 * 		 Refactor QuickDev For extension
 *
 * Copyright 2019-2021 Lamborui
 *
 */

/**
 *
 */
module.exports.FILE_OUTPUT_OPTS = { encoding: 'utf8' }

module.exports.buildModuleIndexComments = function (
  options = {},
  isFunc = false
) {
  const {
    modBase,
    commentsAuthorEnabled = false,
    author,
    email,
    beginVersion = '',
    license = 'no license',
    createDateTime,
    sassFileName,
    modCompFileName,
    modContainerFileName,
    unstyled = false,
    commitHash = '',
  } = options
  let COMMENTS_TPL = ''

  COMMENTS_TPL +=
    '/*!\n' +
    ` * \n` +
    ` * This Module generate by QuickDev Tools. \n` +
    ` * \n` +
    ` * @module\t\t: ${modBase} (begin > ${beginVersion}${
      commitHash ? '[' + commitHash + ']' : ''
    })\n` +
    ` * @createDate\t: ${createDateTime}\n`

  if (commentsAuthorEnabled && author) {
    COMMENTS_TPL += ` * @author\t\t: ${author}`
    email ? (COMMENTS_TPL += `<${email}>\n`) : '\n'
  }

  let domfiles = isFunc
    ? [`${modCompFileName}.jsx`]
    : [`${modCompFileName}.jsx`, `${modContainerFileName}.js`]

  !unstyled && domfiles.push(`${sassFileName}.scss`)

  COMMENTS_TPL +=
    ` * @description\t:\n` +
    ` * \t Entry file\t[index.js] \n` +
    ` * \t DOM files\t[${domfiles.join(',')}]\n` +
    ` * \n` +
    ` * @license ${license} \n` +
    ' *\n' +
    ` */\n`

  return COMMENTS_TPL
}
