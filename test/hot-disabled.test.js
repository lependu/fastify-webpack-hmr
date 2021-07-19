'use strict'

const t = require('tap')
const { join } = require('path')
const { buildServer, testRequest } = require('./test-helper')

const WEBPACK_ENTRY = join(__dirname, '..', 'example', 'client.js')
const opts = {
  config: {
    mode: 'development',
    stats: false,
    entry: WEBPACK_ENTRY,
    output: { publicPath: '/assets', filename: 'main.js' },
    infrastructureLogging: { level: 'none' }
  },
  webpackDev: {},
  webpackHot: false
}

t.test('Works with webpackHot disabled', t => {
  buildServer(t, opts, port => {
    testRequest(t, port, 'assets/main.js', /javascript/, () => t.end())
  })
})
