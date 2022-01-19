module.exports.getGitInfo = getGitInfo

const pkg = require('../../../package.json')

function getGitInfo() {
  let gitState = {
    author: pkg.author || '',
    email: '',
    beginVersion: pkg.version || '',
    commitHash: '',
    license: pkg.license || '',
    projectName: pkg.name || '',
  }

  // check git exist
  const checkGitwork = require('child_process')
    .execSync('git rev-parse --is-inside-work-tree', { encoding: 'utf-8' })
    .replace(/\r|\r\n|\n/g, '')

  if (checkGitwork !== 'true') return gitState

  let gitUser = require('child_process')
    .execSync('git config --get user.name', { encoding: 'utf-8' })
    .replace(/\r|\r\n|\n/g, '')

  let gitEmail = require('child_process')
    .execSync('git config --get user.email', { encoding: 'utf-8' })
    .replace(/\r|\r\n|\n/g, '')

  let commitHash = require('child_process')
    .execSync('git rev-parse --short HEAD', { encoding: 'utf-8' })
    .replace(/\r|\r\n|\n/g, '')

  let remoteUrl = require('child_process')
    .execSync('git remote get-url origin', { encoding: 'utf-8' })
    .replace(/\r|\r\n|\n/g, '')
  const picks = /(?<=\/)[^\/]+(?=\.git)/.exec(remoteUrl)
  let projectName = picks && picks.length ? picks[0] : gitInfo.projectName

  gitState = {
    ...gitState,
    author: gitUser,
    email: gitEmail,
    commitHash: commitHash,
    projectName: projectName,
    remoteUrl: remoteUrl,
  }

  // console.log('Git State>>>', gitState)
  return gitState
}

// getGitInfo()
