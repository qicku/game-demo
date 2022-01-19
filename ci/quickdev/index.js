/*!
 * FilePath     : index.js
 * 2021-12-17 10:30:54
 * Description  : Extension devtools v0.1.0
 * 		 Refactor QuickDev For extension
 *
 * Copyright 2019-2021 Lamborui
 *
 */
const yargs = require('yargs/yargs')

const { hideBin } = require('yargs/helpers')
const { CommonOptionsWrap } = require('./helpers/global-options')
const { buildErrorLog, buildInfoLog } = require('./helpers/logger-builder')
const { generateViewModule } = require('./gen-view')
const { generateFuncModule } = require('./gen-func')

module.exports = main

main()
function main() {
  let cli = CommonOptionsWrap(yargs(hideBin(process.argv)))
    .command({
      command: 'gen-view',
      aliases: ['gv', 'add-view'],
      desc: 'create view module',
    })
    .command({
      command: 'gen-func',
      aliases: ['gf', 'add-func'],
      desc: 'create func module',
    })
    .demandCommand(1, 'At least gen-view or gen-func')
    .conflicts('genview', 'genfunc')
    .wrap(100)

  let argv = cli
    .fail((msg, err, yargs) => {
      if (err) {
        console.log(err)
        yargs.help()
        process.exit(1)
      }
    })
    .parse(process.argv.slice(2))

  const isViewCmd = ['gen-view', 'add-view', 'gv'].includes(argv['_'][0])

  try {
    const resp = isViewCmd ? generateViewModule(argv) : generateFuncModule(argv)
    resp && console.log(resp)
  } catch (err) {
    console.log(buildErrorLog(err.message || err.toString()))

    cli.getHelp().then((h) => {
      console.log(buildInfoLog(h, '→↗↘⇢↗↘⇢ QuickDev Tools'))
    })
  }
}
