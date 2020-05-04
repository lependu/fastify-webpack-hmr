'use strict'

const t = require('tap')
const { initServer } = require('./test-helper')

t.test('Throws if no configuration provided', t => {
  initServer({}, (err, fastify) => {
    t.ok(err instanceof Error)
    t.match(err.message, /Cannot find module/)
    fastify.close()
    t.end()
  })
})
