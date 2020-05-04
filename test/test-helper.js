'use strict'

const Fastify = require('fastify')
const sget = require('simple-get')
const plugin = require('../plugin')

const initServer = (opts, cb) => {
  const fastify = Fastify()
  fastify
    .register(plugin, opts)
    .ready(err => cb(err, fastify))
}

const buildServer = (t, opts, cb) => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.register(plugin, opts)

  fastify.listen(0, err => {
    t.error(err)
    cb(fastify.server.address().port)
  })
}

const testRequest = (t, port, asset, contentType, done) => {
  sget({
    method: 'GET',
    url: `http://127.0.0.1:${port}/${asset}`
  }, (err, res) => {
    t.error(err)
    t.strictEqual(res.statusCode, 200)
    t.match(res.headers['content-type'], contentType)
    res.destroy()
    done()
  })
}

module.exports = {
  buildServer,
  initServer,
  testRequest
}
