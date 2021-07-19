'use strict'

const t = require('tap')
const { join } = require('path')
const { buildServer, testRequest } = require('./test-helper')

const WEBPACK_ENTRY = join(__dirname, '..', 'example', 'client.js')
const hotConf = 'webpack-hot-middleware/client?path=/__webpack_hmr'
const opts = {
  config: {
    mode: 'development',
    stats: false,
    entry: {
      first: [WEBPACK_ENTRY, hotConf],
      second: [WEBPACK_ENTRY, hotConf]
    },
    output: { publicPath: '/assets', filename: '[name].js' },
    infrastructureLogging: { level: 'none' }
  },
  webpackDev: {}
}

t.test('Multiple entries', t => {
  buildServer(t, opts, port => {
    testRequest(t, port, 'assets/first.js', /javascript/, () => {
      testRequest(t, port, 'assets/second.js', /javascript/, () =>
        t.end()
      )
    })
  })
})
