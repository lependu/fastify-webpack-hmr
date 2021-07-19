'use strict'

const t = require('tap')
const { join } = require('path')
const { buildServer, testRequest } = require('./test-helper')

const WEBPACK_ENTRY = join(__dirname, '..', 'example', 'client.js')
const opts = {
  config: {
    mode: 'development',
    entry: WEBPACK_ENTRY,
    stats: false,
    output: { publicPath: '/assets', filename: 'main.js' },
    infrastructureLogging: { level: 'none' }
  },
  webpackDev: {}
}

t.test('Works with config option | string', t => {
  buildServer(t, opts, port => {
    testRequest(t, port, 'assets/main.js', /javascript/, () => t.end())
  })
})
