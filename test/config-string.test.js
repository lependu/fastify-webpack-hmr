'use strict'

const t = require('tap')
const { join } = require('path')
const { buildServer, testRequest } = require('./test-helper')

const WEBPACK_CONFIG =
  join(__dirname, '..', 'example', 'webpack.config.js')
const opts = {
  config: WEBPACK_CONFIG,
  webpackDev: {}
}

t.test('Works with config option | string', t => {
  buildServer(t, opts, port => {
    testRequest(t, port, 'assets/main.js', /javascript/, () => t.end())
  })
})
