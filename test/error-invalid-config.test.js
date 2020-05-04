'use strict'

const t = require('tap')
const { initServer } = require('./test-helper')

const opts = { config: 42 }

t.test('Throws if config option is invalid', t => {
  initServer(opts, (err, fastify) => {
    t.ok(err instanceof Error)
    t.match(err.message, /must be string/g)
    fastify.close()
    t.end()
  })
})
