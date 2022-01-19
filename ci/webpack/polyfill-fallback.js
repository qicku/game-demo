const fallback = {
  url: require.resolve('url'),
  stream: require.resolve('stream-browserify'),
  assert: require.resolve('assert/'),
  os: require.resolve('os-browserify/browser'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  crypto: require.resolve('crypto-browserify'),
  process: require.resolve('process/browser'),
}

module.exports.polyfillResolves = {
  // request$: 'xhr',
}

module.exports.fallback = fallback
