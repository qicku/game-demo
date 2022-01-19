/****************************
 * FilePath: manifest-transform.js
 * 2021-12-31 08:43:46
 * Description:
 * 		 This file is implement
 * Copyright 2018-2021 QuickDev Group, All Rights Reserved.
 *
 */
const { R, src, distTarget, srcRules, pubDir } = require('../paths')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const { EjectEnv, currDotEnvs } = require('./eject-env-plugins')

module.exports.ManifestTransformPlugins = [
  new CopyWebpackPlugin({
    patterns: [
      {
        from: R(srcRules),
        to: R(distTarget, 'rules'),
        force: true,
      },
      {
        from: R(src, 'manifest.json'),
        to: R(distTarget, 'manifest.json'),
        force: true,
        toType: 'file',
        transform: (content, absoluteFrom) => {
          let contentJson = JSON.parse(content.toString())

          const version = EjectEnv['__APP_VERSION__'] || 'BAS'
          const author = EjectEnv['__APP_AUTHOR__'] || 'QuickDev Grp.'

          const { APP_NAME } = currDotEnvs

          const baseManifest = {
            manifest_version: 3,
            name: APP_NAME,
            version,
            author,
            description:
              contentJson.description || currDotEnvs.description || APP_NAME,
          }

          // console.log('>>>>>>>>>>>>>>appTitle>>>', APP_NAME, version)

          contentJson = { ...contentJson, ...baseManifest }

          const _manifest = Object.keys(contentJson)
            .sort()
            .reduce((o, key) => {
              o[key] = contentJson[key]
              return o
            }, {})

          return JSON.stringify({ ...baseManifest, ..._manifest }, null, 2)
        },
      },
    ],
  }),
]
