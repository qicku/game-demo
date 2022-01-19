/****************************
 * FilePath: open-dot-env.js
 * 2022-01-19 20:54:06
 * Description:
 * 		 Generate By Quick DevTools
 * Copyright 2018-2022 QuickDev GRP, All Rights Reserved.
 *
 */

export const storeLogged = process.env.STORE_LOGGED === 'on'
export const appTitle = process.env.APP_TITLE || 'QuickDev Tools'
export const appName = process.env.APP_NAME || 'QuickDev Tools'
export const commitHash = __COMMIT_HASH__
export const appVersion = __APP_VERSION__

const appBase = {
  appName,
  appTitle,
  version: `${appVersion}-${commitHash}`,
}

global.appBase = appBase

export default appBase
