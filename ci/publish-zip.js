#!/usr/bin/env node

const fs = require('fs-extra')
const archiver = require('archiver')
const { PrintInfo, PrintError, PrintRun } = require('./logger')

// process.env.NODE_ENV = 'production'
const { BaseResolve, R, dist, distTarget, distZip } = require('./paths')
const { getAppEnvVars } = require('../config')
const { EjectEnv } = require('./webpack/eject-env-plugins')

main()
  .then((resp) => {})
  .catch((err) => {
    PrintError(err.message)
  })

async function main() {
  PrintRun('Precheck enviroment ....')
  const pubEnvVars = await precheckEnv()
  PrintInfo('Zip env\n' + JSON.stringify(pubEnvVars, null, 2))

  const { publishFile } = await buildZip(pubEnvVars)
  console.log(publishFile)

  writePublishLog({ ...pubEnvVars, publishFile })
}

async function precheckEnv() {
  const envVars = getAppEnvVars()
  let appName = envVars['APP_NAME']
  let { __APP_VERSION__: version, __COMMIT_HASH__: commitHash } = EjectEnv
  let versionTag = commitHash ? `${version}-${commitHash}` : version

  const releaseName = `${appName}-${versionTag}`

  if (!fs.existsSync(distTarget)) {
    throw new Error(
      `Source Dir [${sourceCrxFile}] not exists,Please build first use 'yarn build' command.`
    )
  }

  let sourceCrxFile = R(dist, 'chrome.crx')
  if (!fs.existsSync(sourceCrxFile)) {
    throw new Error(
      `Source File [${sourceCrxFile}] unfound,Please create use chrome web store tools.`
    )
  }
  const chromeKey = R(distZip, 'chrome.pem')
  if (!fs.existsSync(chromeKey)) {
    throw new Error(
      `Key [${chromeKey}] unfound,Please create use chrome web store tools.`
    )
  }

  let pubEnvVars = {
    appName,
    version,
    commitHash,
    versionTag,
    releaseName,
    zipSourceDir: distTarget,
    sourceCrxFile,
    chromeKey,
  }

  return pubEnvVars
}

function buildZip({
  releaseName,
  appName,
  version,
  zipSourceDir,
  sourceCrxFile,
  chromeKey,
}) {
  const releaseFile = R(distZip, `${releaseName}.zip`)
  if (fs.existsSync(releaseFile)) {
    fs.removeSync(releaseFile) // delete
  }
  const archive = archiver('zip', { zlib: { level: 9 } })
  const stream = fs.createWriteStream(releaseFile)

  return new Promise((resolve, reject) => {
    archive
      .file(sourceCrxFile, { name: `${appName}-${version}.crx` })
      .file(chromeKey, { name: 'key.pem' })
      .directory(zipSourceDir, false)
      .on('error', (err) => reject(err))
      .pipe(stream)

    stream.on('close', () => {
      fs.removeSync(sourceCrxFile)
      return resolve({ publishFile: `dist-zip/${releaseName}.zip` })
    })
    archive.finalize()
  })
}

async function writePublishLog({ versionTag, appName, publishFile }) {
  const opts = { encoding: 'utf8' }
  /**
   * Title : #
   */
  const publog = BaseResolve('docs', `PUBLISHLOG.md`)
  fs.ensureFileSync(publog)
  const dataTime = currentDateTime()

  fs.appendFileSync(publog, `---\n\n# Release ${versionTag}\n\n`, opts)

  let verContent = `> ${appName} ${versionTag} published on ${dataTime} \n`
  verContent += `\n- File: ${publishFile} \n`
  fs.appendFileSync(publog, verContent, opts)
}

function formatTitle(versionTag) {
  return `# Release `
}

function currentDateTime() {
  const d = new Date()
  let m = (d.getMonth() + 1).toString()
  m = m.length > 0 ? m : `0${m}`

  let day = d.getDate().toString()
  day = day.length > 1 ? day : `0${day}`

  let hours = d.getHours().toString()
  hours = hours.length > 1 ? hours : `0${hours}`
  let minutes = d.getMinutes().toString()

  minutes = minutes.length > 1 ? minutes : `0${minutes}`

  return `${d.getFullYear()}-${m}-${day} ${hours}:${minutes}`
}

function currentDate() {
  const d = new Date()
  let m = d.getMonth().toString()
  m = m.length > 0 ? m : `0${m}`

  let day = d.getDate().toString()
  day = day.length > 1 ? day : `0${day}`

  return `${d.getFullYear()}-${m}-${day}`
}
