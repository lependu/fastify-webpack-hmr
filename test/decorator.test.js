'use strict'

const t = require('tap')
const { join } = require('path')
const { initServer } = require('./test-helper')

const WEBPACK_ENTRY = join(__dirname, '..', 'example', 'client.js')
const opts = {
  config: {
    mode: 'development',
    stats: false,
    entry: WEBPACK_ENTRY,
    output: { publicPath: '/assets', filename: 'main.js' },
    infrastructureLogging: { level: 'none' }
  },
  webpackDev: {}
}

t.test('Decorates instance', t => {
  initServer(opts, (err, fastify) => {
    t.error(err)
    t.equal(typeof fastify.webpack.compiler, 'object')
    t.equal(typeof fastify.webpack.dev, 'function')
    t.equal(typeof fastify.webpack.hot, 'function')
    fastify.close()
    t.end()
  })
})
