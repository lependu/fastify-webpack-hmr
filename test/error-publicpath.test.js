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
    output: { filename: 'main.js' },
    infrastructureLogging: { level: 'none' }
  }
}

t.test('Works without publicPath config option', t => {
  buildServer(t, opts, port => {
    testRequest(t, port, 'main.js', /javascript/, () => t.end())
  })
})
