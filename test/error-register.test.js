'use strict'

const t = require('tap')
const { join } = require('path')
const Fastify = require('fastify')
const plugin = require('../plugin')

const WEBPACK_ENTRY = join(__dirname, '..', 'example', 'client.js')

t.test('Throws if fastify.webpack has registered already', t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())

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

  fastify
    .decorate('webpack', {})
    .register(plugin, opts)
    .ready(err => {
      t.ok(err instanceof Error)
      t.match(err.message, /fastify.webpack has registered already./)
      t.end()
    })
})
