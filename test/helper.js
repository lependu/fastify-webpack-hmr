'use strict'

const Fastify = require('fastify')
const get = require('simple-get')
const plugin = require('../plugin')

function register (t, opts, callback) {
  const fastify = Fastify()

  t.tearDown(() => fastify.close())

  fastify
    .register(plugin, opts)
    .ready(err => {
      callback(err, fastify)
    })
}

function testHMR (t, opts, asset) {
  const fastify = Fastify()
  t.tearDown(() => fastify.close())

  fastify.register(plugin, opts)

  fastify.listen(0, err => {
    t.error(err)
    let port = fastify.server.address().port
    get(
      `http://127.0.0.1:${port}/__webpack_hmr`,
      function (err, res) {
        t.error(err)
        t.strictEqual(res.statusCode, 200)
        t.match(res.headers['content-type'], /text\/event-stream/)
        res.destroy()
      }
    )
    get(
      `http://127.0.0.1:${port}/${asset}`,
      function (err, res) {
        t.error(err)
        t.strictEqual(res.statusCode, 200)
        t.match(res.headers['content-type'], /application\/javascript/)
        res.destroy()
      }
    )
  })
}

module.exports.register = register
module.exports.testHMR = testHMR
