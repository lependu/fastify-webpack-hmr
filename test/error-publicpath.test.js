'use strict'

const t = require('tap')
const { join } = require('path')
const { initServer } = require('./test-helper')

const WEBPACK_ENTRY = join(__dirname, '..', 'example', 'client.js')
const opts = {
  config: {
    mode: 'development',
    entry: WEBPACK_ENTRY,
    stats: false,
    output: { filename: 'main.js' }
  }
}

t.test('Throws if no publicPath option provided', t => {
  initServer(opts, (err, fastify) => {
    t.ok(err instanceof Error)
    t.match(err.message, /publicPath must be set/)
    fastify.close()
    t.end()
  })
})
