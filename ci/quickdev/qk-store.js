/*!
 * FilePath     : qk-store.js
 * 2021-12-22 12:53:16
 * Description  : Extension devtools v0.1.0
 * 		 Refactor QuickDev For extension
 *
 * Copyright 2019-2021 Lamborui
 *
 */
const yargs = require('yargs/yargs')

const { hideBin } = require('yargs/helpers')

const { buildPurpleFont } = require('./helpers/logger-builder')
const { StoreOptionsWrap } = require('./helpers/global-store-options')
const { generateStoreModule } = require('./gen-store')

main()

function main() {
  let cli = StoreOptionsWrap(yargs(hideBin(process.argv)))

  try {
    const argv = cli.parse(process.argv.slice(2))
    const resp = generateStoreModule(argv)
    resp && console.log(resp)
  } catch (err) {
    // console.log(err)
    console.log(err.message || err.toString())
    console.log(buildPurpleFont(cli.getHelp()))
  }
}
