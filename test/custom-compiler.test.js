'use strict'

const t = require('tap')
const { join } = require('path')
const webpack = require('webpack')
const { buildServer, testRequest } = require('./test-helper')

const WEBPACK_ENTRY = join(__dirname, '..', 'example', 'client.js')
const opts = {
  mode: 'development',
  entry: WEBPACK_ENTRY,
  output: { publicPath: '/assets', filename: 'main.js' },
  infrastructureLogging: { level: 'none' }
}
const compiler = webpack(opts)
const webpackDev = {}

t.test('Works with custom compiler', t => {
  buildServer(t, { compiler, webpackDev }, port => {
    testRequest(t, port, 'assets/main.js', /javascript/, () => t.end())
  })
})
