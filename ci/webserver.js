const open = require('open')
const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')

const { distTarget } = require('./paths')
const devWebpackOptions = require('./webpack/webpack.dev')

const port = process.env.port || 17315

const getOpenBrowser = () => {
  let bsTarget = process.env['BS_TARGET'] || ''
  switch (bsTarget.toLowerCase()) {
    case 'chrome':
      return {
        target: ['/'],
        app: open.apps.chrome,
      }
    case 'firefox':
    case 'fox':
      return {
        target: ['/'],
        app: open.apps.firefox,
      }
    case 'edge':
      return {
        target: ['/'],
        app: open.apps.edge,
      }
    default:
      return false
  }
}

const devServerOptions = {
  static: {
    directory: distTarget,
  },
  historyApiFallback: {
    //https://github.com/bripkens/connect-history-api-fallback
    index: 'index.html',
    rewrites: [{ from: /\//, to: '/index.html' }],
  },
  open: getOpenBrowser(),
  compress: true,
  hot: true,
  port: port,
  proxy: {},
  devMiddleware: {
    publicPath: `http://localhost:${port}/`,
    writeToDisk: true,
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  // allowedHosts: ['xxx.com'], // all,auto,['']
}
// extension set 127.0.0.1 app 0.0.0.0 resolve permission for websocket
devServerOptions.host = '127.0.0.1'
const compiler = webpack(devWebpackOptions)
const server = new WebpackDevServer(devServerOptions, compiler)

/** Run */

const startServer = async () => {
  server.startCallback(() => {
    console.log('>>>>start server')
  })
}

startServer()
