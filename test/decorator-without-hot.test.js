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
  webpackDev: {},
  webpackHot: false
}

t.test('Decorates instance | webpackHot = false', t => {
  initServer(opts, (err, fastify) => {
    t.error(err)
    t.equal(typeof fastify.webpack.compiler, 'object')
    t.equal(typeof fastify.webpack.dev, 'function')
    t.equal(fastify.webpack.hot, null)
    fastify.close()
    t.end()
  })
})
