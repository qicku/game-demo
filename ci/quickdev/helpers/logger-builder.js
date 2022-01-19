/*!
 * FilePath     : logger-builder.js
 * 2021-12-20 15:30:49
 * Description  : Extension devtools v0.1.0
 * 		 This file is implement
 *
 * Copyright 2019-2021 Lamborui
 *
 */

/**
 *
 * @param {string} errMsg
 * @param {string} title
 */
module.exports.buildErrorLog = function (errMsg = '', title = '') {
  return title
    ? `\x1b[31m❌ ${title}\x1b[0m\n\t\x1b[1;36m${errMsg}\x1b[0m`
    : `\x1b[31m❌❌❌ \x1b[0m\x1b[1;36m${errMsg}\x1b[0m`
}

module.exports.buildInfoLog = function (infoMsg = '', title = '') {
  return !!title
    ? `\x1b[32m ${title} \x1b[0m\n\t\x1b[36m${infoMsg}\x1b[0m`
    : `\x1b[36m${infoMsg}\x1b[0m`
}

module.exports.buildPurpleFont = function (msg = '') {
  return `\x1b[1;35m${msg}\x1b[0m`
}

module.exports.buildHighlightFont = function (msg = '') {
  return `\x1b[5;33m${msg}\x1b[0m`
}
