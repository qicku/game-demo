/*!
 * FilePath     : qk-setting.js
 * 2021-12-17 10:51:11
 * Description  : Extension devtools v0.1.0
 * 		 Refactor QuickDev For extension
 *
 * Copyright 2019-2021 Lamborui
 *
 */
const { getGitInfo } = require('./helpers/gitbash-helper')

const gitState = getGitInfo()
module.exports.quickSettings = {
  author: 'QuickDev',
  version: '1.0.0',
  defaultSoreRoot: 'store',
  defaultPagesRoot: '',
  defaultViewBase: 'views',
  defaultPage: 'popup',
  commentsAuthorEnabled: true,
  addonMode: false, // true =>> extension,
  i18nextEnabled: true,
  allPages: ['popup', 'options', 'newtab', 'unfound'],
  ...gitState,
}

module.exports.quickRules = {
  RESERVED_KEYWORDS_4NAME: ['container'],
  RESERVED_KEYWORDS_4MODSUFFIX: ['comp', 'page', 'container'],
  RESERVED_KEYWORDS_4SASSPREFIX: ['index', 'page'],
}
